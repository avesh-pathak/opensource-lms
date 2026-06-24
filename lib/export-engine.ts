import { stringify } from 'csv-stringify/sync'
import ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// Type definitions for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export interface ExportData {
  filename: string
  columns: { header: string; key: string; width?: number }[]
  data: any[]
  title?: string
  summary?: Record<string, string | number>
}

export class ExportEngine {
  /**
   * Generates a CSV string
   */
  static async toCSV(config: ExportData): Promise<string> {
    const records = config.data.map((item) => {
      const row: any = {}
      config.columns.forEach((col) => {
        row[col.header] = item[col.key]
      })
      return row
    })

    return stringify(records, { header: true })
  }

  /**
   * Generates an ExcelBuffer
   */
  static async toExcel(config: ExportData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(config.title || 'Export')

    worksheet.columns = config.columns
    worksheet.addRows(config.data)

    // Style the header
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEEEEEE' },
    }

    return (await workbook.xlsx.writeBuffer()) as any
  }

  /**
   * Generates a PDF as a Buffer (Uint8Array)
   */
  static async toPDF(config: ExportData): Promise<Uint8Array> {
    const doc = new jsPDF()
    const title = config.title || 'LMS Admin Report'

    // Header
    doc.setFontSize(20)
    doc.text(title, 14, 22)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30)

    // Summary Cards (if available)
    let startY = 40
    if (config.summary) {
      doc.setFontSize(12)
      doc.setTextColor(0)
      Object.entries(config.summary).forEach(([key, value], index) => {
        doc.text(
          `${key}: ${value}`,
          14 + (index % 2) * 90,
          startY + Math.floor(index / 2) * 8
        )
      })
      startY += Math.ceil(Object.keys(config.summary).length / 2) * 10 + 10
    }

    // Table
    const head = [config.columns.map((c) => c.header)]
    const body = config.data.map((item) =>
      config.columns.map((c) => item[c.key])
    )

    doc.autoTable({
      head,
      body,
      startY,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] }, // orange-500
      styles: { fontSize: 8 },
    })

    return new Uint8Array(doc.output('arraybuffer'))
  }
}
