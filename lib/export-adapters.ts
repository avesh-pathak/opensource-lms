import User from '@/models/User'
import Submission from '@/models/Submission'
import ActivityLog from '@/models/ActivityLog'
import { ExportData } from './export-engine'

export class ExportAdapters {
  /**
   * Helper to process common filters
   */
  private static processFilters(filters: any = {}) {
    const query: any = {}

    if (
      filters.days &&
      typeof filters.days === 'number' &&
      filters.days < 1000
    ) {
      const date = new Date()
      date.setDate(date.getDate() - filters.days)
      query.createdAt = { $gte: date }
    }

    return query
  }

  /**
   * Adapts User data for Students Export
   */
  static async students(filters: any = {}): Promise<ExportData> {
    const query = this.processFilters(filters)
    const users = await User.find(query).populate('solvedProblems').lean()

    const data = users.map((u: any) => ({
      student_id: u._id.toString(),
      full_name: u.name,
      email: u.email,
      username: u.username || 'N/A',
      experience_points: u.experiencePoints || 0,
      solved_count: u.solvedProblems?.length || 0,
      streak: u.currentStreak || 0,
      join_date: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString()
        : 'N/A',
      last_active: u.lastActivityDate
        ? new Date(u.lastActivityDate).toLocaleDateString()
        : 'Never',
      status: u.isBanned ? 'Banned' : 'Active',
    }))

    return {
      filename: `students_export_${new Date().toISOString().split('T')[0]}`,
      title: 'LMS Student Report',
      columns: [
        { header: 'ID', key: 'student_id', width: 25 },
        { header: 'Name', key: 'full_name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Username', key: 'username', width: 20 },
        { header: 'XP', key: 'experience_points', width: 10 },
        { header: 'Solved', key: 'solved_count', width: 10 },
        { header: 'Streak', key: 'streak', width: 10 },
        { header: 'Joined', key: 'join_date', width: 15 },
        { header: 'Last Active', key: 'last_active', width: 15 },
        { header: 'Status', key: 'status', width: 10 },
      ],
      data,
      summary: {
        'Total Students': users.length,
        'Active Students': users.filter((u: any) => !u.isBanned).length,
        'Average XP': Math.floor(
          users.reduce(
            (acc: number, u: any) => acc + (u.experiencePoints || 0),
            0
          ) / (users.length || 1)
        ),
      },
    }
  }

  /**
   * Adapts Submission data for Results Export
   */
  static async results(filters: any = {}): Promise<ExportData> {
    const query = this.processFilters(filters)
    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('problemId', 'title difficulty category')
      .lean()

    const data = submissions.map((s: any) => ({
      submission_id: s._id.toString(),
      student_name: s.userId?.name || 'Unknown',
      problem_title: s.problemId?.title || 'Unknown',
      difficulty: s.problemId?.difficulty || 'N/A',
      category: s.problemId?.category || 'N/A',
      status: s.status,
      score: s.score || 0,
      language: s.language || 'N/A',
      attempted_on: s.createdAt
        ? new Date(s.createdAt).toLocaleString()
        : 'N/A',
    }))

    return {
      filename: `submission_results_${new Date().toISOString().split('T')[0]}`,
      title: 'Submission Results Report',
      columns: [
        { header: 'Name', key: 'student_name', width: 25 },
        { header: 'Problem', key: 'problem_title', width: 30 },
        { header: 'Difficulty', key: 'difficulty', width: 12 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Language', key: 'language', width: 12 },
        { header: 'Date', key: 'attempted_on', width: 20 },
      ],
      data,
      summary: {
        'Total Submissions': submissions.length,
        Accepted: submissions.filter((s: any) => s.status === 'ACCEPTED')
          .length,
        'Success Rate':
          submissions.length > 0
            ? (
                (submissions.filter((s: any) => s.status === 'ACCEPTED')
                  .length /
                  submissions.length) *
                100
              ).toFixed(1) + '%'
            : '0%',
      },
    }
  }

  /**
   * Adapts ActivityLog for Audit Logs Export
   */
  static async auditLogs(filters: any = {}): Promise<ExportData> {
    const query = this.processFilters(filters)
    const logs = await ActivityLog.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()

    const data = logs.map((l: any) => ({
      log_id: l._id.toString(),
      user: l.userId?.name || 'System',
      email: l.userId?.email || 'N/A',
      action: l.action,
      timestamp: l.createdAt.toLocaleString(),
      metadata: JSON.stringify(l.metadata || {}),
    }))

    return {
      filename: `audit_logs_${new Date().toISOString().split('T')[0]}`,
      title: 'LMS Audit Log Report',
      columns: [
        { header: 'User', key: 'user', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Action', key: 'action', width: 20 },
        { header: 'Time', key: 'timestamp', width: 20 },
        { header: 'Metadata', key: 'metadata', width: 50 },
      ],
      data,
    }
  }
}
