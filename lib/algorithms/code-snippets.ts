export const ALGORITHM_DATA = {
  LINEAR_SEARCH: {
    name: 'Linear Search',
    code: {
      pseudo: `Algorithm LinearSearch(array, target):
  For each index i from 0 to length - 1:
    If array[i] == target:
      Return i (Found)
  
  Return -1 (Not Found)`,
    },
    complexity: {
      best: 'Ω(1)',
      worst: 'O(n)',
      average: 'Θ(n)',
    },
  },

  BINARY_SEARCH: {
    name: 'Binary Search',
    code: {
      pseudo: `Algorithm BinarySearch(array, target):
  Set left = 0, right = length - 1
  While left <= right:
    Set mid = floor((left + right) / 2)
    If array[mid] == target:
      Return mid
    If array[mid] < target:
      Set left = mid + 1
    Else:
      Set right = mid - 1
  Return -1 (Not Found)`,
    },
    complexity: {
      best: 'Ω(1)',
      worst: 'O(log n)',
      average: 'Θ(log n)',
    },
  },

  TWO_POINTERS: {
    name: 'Two Pointers',
    code: {
      pseudo: `Algorithm TwoSum(array, target):
  Set left = 0
  Set right = length - 1

  While left < right:
    current_sum = array[left] + array[right]

    If current_sum == target:
      Return [left, right]
    
    If current_sum < target:
      Increment left
    Else:
      Decrement right
            
  Return [-1, -1]`,
    },
    complexity: {
      best: 'Ω(1)',
      worst: 'O(n)',
      average: 'Θ(n)',
    },
  },

  BUBBLE_SORT: {
    name: 'Bubble Sort',
    code: {
      pseudo: `Algorithm BubbleSort(array):
  Set n = length of array
  For i from 0 to n - 1:
    For j from 0 to n - i - 1:
      If array[j] > array[j+1]:
        Swap array[j] and array[j+1]`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n²)', average: 'Θ(n²)' },
  },

  SELECTION_SORT: {
    name: 'Selection Sort',
    code: {
      pseudo: `Algorithm SelectionSort(array):
  Set n = length of array
  For i from 0 to n - 1:
    Set min_idx = i
    For j from i + 1 to n:
      If array[j] < array[min_idx]:
        min_idx = j
    
    If min_idx != i:
      Swap array[i] and array[min_idx]`,
    },
    complexity: { best: 'Ω(n²)', worst: 'O(n²)', average: 'Θ(n²)' },
  },

  INSERTION_SORT: {
    name: 'Insertion Sort',
    code: {
      pseudo: `Algorithm InsertionSort(array):
  For i from 1 to length - 1:
    key = array[i]
    j = i - 1
    While j >= 0 and array[j] > key:
      array[j + 1] = array[j]
      j = j - 1
    array[j + 1] = key`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n²)', average: 'Θ(n²)' },
  },

  MERGE_SORT: {
    name: 'Merge Sort',
    code: {
      pseudo: `Algorithm MergeSort(arr, l, r):
  If l >= r: return
  mid = floor((l + r) / 2)
  MergeSort(arr, l, mid)
  MergeSort(arr, mid + 1, r)
  Merge(arr, l, mid, r)`,
    },
    complexity: {
      best: 'Ω(n log n)',
      worst: 'O(n log n)',
      average: 'Θ(n log n)',
    },
  },

  QUICK_SORT: {
    name: 'Quick Sort',
    code: {
      pseudo: `Algorithm QuickSort(arr, low, high):
  If low < high:
    pi = Partition(arr, low, high)
    QuickSort(arr, low, pi - 1)
    QuickSort(arr, pi + 1, high)`,
    },
    complexity: { best: 'Ω(n log n)', worst: 'O(n²)', average: 'Θ(n log n)' },
  },

  PALINDROME_CHECK: {
    name: 'Palindrome Check',
    code: {
      pseudo: `Algorithm PalindromeCheck(text):
  Set left = 0, right = length - 1
  
  While left < right:
    If text[left] != text[right]:
      Return False (Mismatch)
    
    // Move pointers inward
    Increment left
    Decrement right
  
  Return True (Palindrome)`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(n)', average: 'Θ(n)' },
  },

  LONGEST_SUBSTRING: {
    name: 'Longest Substring w/o Repeats',
    code: {
      pseudo: `Algorithm LengthOfLongestSubstring(s):
  Map charMap
  left = 0, maxLength = 0
  
  For right from 0 to length - 1:
    If s[right] in charMap:
      left = max(left, charMap[s[right]] + 1)
      
    charMap[s[right]] = right
    maxLength = max(maxLength, right - left + 1)
    
  Return maxLength`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  LONGEST_PALINDROMIC_SUBSTRING: {
    name: 'Longest Palindromic Substring',
    code: {
      pseudo: `Algorithm LongestPalindrome(s):
  If length < 1: return ""
  start = 0, end = 0
  
  For i from 0 to length - 1:
    len1 = expandCenter(s, i, i)
    len2 = expandCenter(s, i, i + 1)
    len = max(len1, len2)
    
    If len > end - start:
      start = i - (len - 1) / 2
      end = i + len / 2
      
  Return s[start...end]`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n²)', average: 'Θ(n²)' },
  },

  COUNT_PALINDROMIC_SUBSTRINGS: {
    name: 'Count Palindromic Substrings',
    code: {
      pseudo: `Algorithm CountSubstrings(s):
  count = 0
  
  For i from 0 to length - 1:
    // Odd length
    count += countPals(s, i, i)
    // Even length
    count += countPals(s, i, i + 1)
    
  Return count`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n²)', average: 'Θ(n²)' },
  },

  REVERSE_STRING: {
    name: 'Reverse String',
    code: {
      pseudo: `Algorithm ReverseString(s):
  Set left = 0, right = length - 1
  
  While left < right:
    Swap s[left] and s[right]
    Increment left
    Decrement right
    
  Return s`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  LONGEST_COMMON_SUBSEQUENCE: {
    name: 'Longest Common Subsequence',
    code: {
      pseudo: `Algorithm LCS(text1, text2):
  m = length(text1), n = length(text2)
  dp = Matrix[m+1][n+1]
  
  For i from 1 to m:
    For j from 1 to n:
      If text1[i-1] == text2[j-1]:
        dp[i][j] = 1 + dp[i-1][j-1]
      Else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        
  Return dp[m][n]`,
    },
    complexity: { best: 'Ω(n*m)', worst: 'O(n*m)', average: 'Θ(n*m)' },
  },

  VALID_PARENTHESES: {
    name: 'Valid Parentheses Checker',
    code: {
      pseudo: `Algorithm IsValid(s):
  stack = Empty Stack
  For each char in s:
    If char is opening '(', '{', '[':
      stack.push(char)
    Else:
      If stack is empty or mismatch:
        Return False
      stack.pop()
  Return stack.isEmpty()`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  NEXT_GREATER_ELEMENT: {
    name: 'Next Greater Element',
    code: {
      pseudo: `Algorithm NGE(arr):
  n = length(arr)
  res = Array of size n, init -1
  stack = Empty Stack
  For i from 0 to n - 1:
    While stack not empty and arr[stack.top] < arr[i]:
      idx = stack.pop()
      res[idx] = arr[i]
    stack.push(i)
  Return res`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  SLIDING_WINDOW_MAX: {
    name: 'Sliding Window Maximum',
    code: {
      pseudo: `Algorithm SlidingWindowMax(nums, k):
  deque = Empty Deque
  res = []
  For i from 0 to length(nums) - 1:
    If deque not empty and deque.front == i - k:
      deque.pop_front()
    While deque not empty and nums[deque.back] < nums[i]:
      deque.pop_back()
    deque.push_back(i)
    If i >= k - 1:
      res.push(nums[deque.front])
  Return res`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  LARGEST_RECTANGLE: {
    name: 'Largest Rectangle in Histogram',
    code: {
      pseudo: `Algorithm LargestRectangle(heights):
  stack = Empty Stack (indices)
  max_area = 0
  For i from 0 to length(heights):
    h = (i == n) ? 0 : heights[i]
    While stack not empty and heights[stack.top] > h:
      height = heights[stack.pop()]
      width = stack.empty() ? i : (i - stack.top - 1)
      max_area = max(max_area, height * width)
    stack.push(i)
  Return max_area`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  MIN_STACK: {
    name: 'Min Stack Implementation',
    code: {
      pseudo: `Algorithm MinStack:
  mainStack = []
  minStack = []
  
  Push(val):
    mainStack.push(val)
    If minStack empty or val <= minStack.top:
      minStack.push(val)
      
  Pop():
    If mainStack.top == minStack.top:
      minStack.pop()
    Return mainStack.pop()
    
  GetMin():
    Return minStack.top`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(1)', average: 'Θ(1)' },
  },
  CIRCULAR_QUEUE: {
    name: 'Circular Queue Operations',
    code: {
      pseudo: `Algorithm CircularQueue:
  Enqueue(val):
    If (tail + 1) % size == head: 
      Return "Full"
    If head == -1: 
      head = 0
    tail = (tail + 1) % size
    queue[tail] = val
  
  Dequeue():
    If head == -1: 
      Return "Empty"
    val = queue[head]
    If head == tail: 
      head = tail = -1
    Else: 
      head = (head + 1) % size
    Return val`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(1)', average: 'Θ(1)' },
  },

  TASK_SCHEDULING: {
    name: 'Round Robin Scheduling',
    code: {
      pseudo: `Algorithm RoundRobin(tasks, quantum):
  While queue not empty:
    task = queue.dequeue()
    runtime = min(task.time, quantum)
    execute(task, runtime)
    If task.time > 0:
      queue.enqueue(task)
    Else:
      task.finish()`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n*m)', average: 'Θ(n*m)' },
  },

  PRIORITY_QUEUE_SIM: {
    name: 'Priority Queue (Min-Heap)',
    code: {
      pseudo: `Algorithm PriorityQueuePush(val):
  heap.push(val)
  curr = heap.length - 1
  While curr > 0 and heap[curr] < heap[parent]:
    swap(heap[curr], heap[parent])
    curr = parent`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(log n)', average: 'Θ(log n)' },
  },

  LL_REVERSE: {
    name: 'Iterative LinkedList Reversal',
    code: {
      pseudo: `Algorithm Reverse(head):
  Set prev = null, curr = head
  While curr is not null:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  Return prev (new head)`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  LL_DETECT_CYCLE: {
    name: "Floyd's Cycle-Finding Algorithm",
    code: {
      pseudo: `Algorithm DetectCycle(head):
  Set slow = head, fast = head
  While fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    If slow == fast:
      Return True (Cycle Found)
  Return False (No Cycle)`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(n)', average: 'Θ(n)' },
  },

  LL_MERGE_SORTED: {
    name: 'Merge Two Sorted Lists',
    code: {
      pseudo: `Algorithm MergeLists(l1, l2):
  Set dummy = new Node(), tail = dummy
  While l1 and l2:
    If l1.val <= l2.val:
      tail.next = l1, l1 = l1.next
    Else:
      tail.next = l2, l2 = l2.next
    tail = tail.next
  tail.next = l1 OR l2
  Return dummy.next`,
    },
    complexity: { best: 'Ω(n+m)', worst: 'O(n+m)', average: 'Θ(n+m)' },
  },

  LL_MIDDLE_NODE: {
    name: 'Find Middle of LinkedList',
    code: {
      pseudo: `Algorithm MiddleNode(head):
  Set slow = head, fast = head
  While fast and fast.next:
    slow = slow.next
    fast = fast.next.next
  Return slow (middle node)`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  TREE_TRAVERSAL: {
    name: 'Tree Traversals (DFS)',
    code: {
      pseudo: `Algorithm InOrder(root):
  If root is null: Return
  InOrder(root.left)
  Visit(root.val)
  InOrder(root.right)`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  TREE_BFS: {
    name: 'Level Order Traversal (BFS)',
    code: {
      pseudo: `Algorithm LevelOrder(root):
  Set q = new Queue()
  q.enqueue(root)
  While q is not empty:
    node = q.dequeue()
    Visit(node.val)
    If node.left: q.enqueue(node.left)
    If node.right: q.enqueue(node.right)`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  TREE_LCA: {
    name: 'Lowest Common Ancestor',
    code: {
      pseudo: `Algorithm LCA(root, p, q):
  If root matches p or q: Return root
  left = LCA(root.left, p, q)
  right = LCA(root.right, p, q)
  If left and right: Return root
  Return left OR right`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(h)', average: 'Θ(h)' },
  },

  BST_OPERATIONS: {
    name: 'BST Operations',
    code: {
      pseudo: `Algorithm Insert(root, val):
  If root is null: Return new Node(val)
  If val < root.val:
    root.left = Insert(root.left, val)
  Else:
    root.right = Insert(root.right, val)
  Return root`,
    },
    complexity: { best: 'Ω(log n)', worst: 'O(n)', average: 'Θ(log n)' },
  },

  HASH_TWO_SUM: {
    name: 'Two Sum (Hash Map Lookup)',
    code: {
      pseudo: `Algorithm TwoSum(nums, target):
  Set map = new HashMap()
  For each i, num in nums:
    complement = target - num
    If complement in map:
      Return [map[complement], i]
    map[num] = i
  Return []`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(n)', average: 'Θ(1)' },
  },

  HASH_CONSECUTIVE: {
    name: 'Longest Consecutive Sequence',
    code: {
      pseudo: `Algorithm Consecutive(nums):
  Set s = new HashSet(nums)
  Set max_streak = 0
  For num in s:
    If num-1 not in s:
      curr = num, streak = 1
      While curr+1 in s:
        curr += 1, streak += 1
      max_streak = max(max_streak, streak)
  Return max_streak`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  HASH_COLLISION: {
    name: 'Hash Collision (Chaining)',
    code: {
      pseudo: `Algorithm Insert(table, key, val):
  index = hash(key) % size
  bucket = table[index]
  For item in bucket:
    If item.key == key:
      item.val = val; Return
  bucket.add(new Item(key, val))`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(n)', average: 'Θ(1)' },
  },

  SW_MAX_SUM: {
    name: 'Max Sum Subarray (Fixed Window)',
    code: {
      pseudo: `Algorithm MaxSumSubarray(arr, k):
  windowSum = sum of first k elements
  maxSum = windowSum

  For end from k to length - 1:
    windowSum -= arr[end - k]
    windowSum += arr[end]
    If windowSum > maxSum:
      maxSum = windowSum

  Return maxSum`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  SW_LONGEST_SUBSTRING: {
    name: 'Longest Substring Without Repeating',
    code: {
      pseudo: `Algorithm LongestSubstring(s):
  Set left = 0, maxLen = 0
  Set charSet = empty

  For right from 0 to length - 1:
    While s[right] in charSet:
      Remove s[left] from charSet
      left++
    Add s[right] to charSet
    maxLen = max(maxLen, right - left + 1)

  Return maxLen`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  SW_MIN_SIZE_SUBARRAY: {
    name: 'Min Size Subarray (Sum >= Target)',
    code: {
      pseudo: `Algorithm MinSizeSubarray(arr, target):
  left = 0, sum = 0, minLen = infinity

  For right from 0 to length - 1:
    sum += arr[right]
    While sum >= target:
      minLen = min(minLen, right - left + 1)
      sum -= arr[left]
      left++

  Return minLen (or 0 if none)`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  TP_TWO_SUM_SORTED: {
    name: 'Two Sum (Sorted Array)',
    code: {
      pseudo: `Algorithm TwoSumSorted(arr, target):
  left = 0, right = length - 1

  While left < right:
    sum = arr[left] + arr[right]
    If sum == target: Return [left, right]
    If sum < target: left++
    Else: right--

  Return []`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(n)', average: 'Θ(n)' },
  },

  TP_PALINDROME: {
    name: 'Palindrome Check (Two Pointers)',
    code: {
      pseudo: `Algorithm Palindrome(s):
  left = 0, right = length - 1

  While left < right:
    If s[left] != s[right]:
      Return False
    left++, right--

  Return True`,
    },
    complexity: { best: 'Ω(1)', worst: 'O(n)', average: 'Θ(n)' },
  },

  TP_SORT_COLORS: {
    name: 'Sort Colors (Dutch National Flag)',
    code: {
      pseudo: `Algorithm SortColors(nums):
  low = mid = 0, high = length - 1

  While mid <= high:
    If nums[mid] == 0: swap(low, mid); low++; mid++
    Else If nums[mid] == 1: mid++
    Else: swap(mid, high); high--`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  TP_CONTAINER: {
    name: 'Container With Most Water',
    code: {
      pseudo: `Algorithm MaxArea(heights):
  left = 0, right = length - 1, maxArea = 0

  While left < right:
    area = min(h[left], h[right]) * (right - left)
    maxArea = max(maxArea, area)
    If h[left] < h[right]: left++
    Else: right--

  Return maxArea`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  REC_FIBONACCI: {
    name: 'Fibonacci (Recursive Tree)',
    code: {
      pseudo: `Algorithm Fibonacci(n):
  If n <= 1: Return n
  Return Fibonacci(n-1) + Fibonacci(n-2)`,
    },
    complexity: { best: 'Ω(2^n)', worst: 'O(2^n)', average: 'Θ(2^n)' },
  },

  REC_TOWER_OF_HANOI: {
    name: 'Tower of Hanoi',
    code: {
      pseudo: `Algorithm Hanoi(n, from, to, aux):
  If n == 1:
    Move disk 1 from 'from' to 'to'
    Return
  Hanoi(n-1, from, aux, to)
  Move disk n from 'from' to 'to'
  Hanoi(n-1, aux, to, from)`,
    },
    complexity: { best: 'Ω(2^n)', worst: 'O(2^n)', average: 'Θ(2^n)' },
  },

  REC_FACTORIAL: {
    name: 'Factorial (Recursive)',
    code: {
      pseudo: `Algorithm Factorial(n):
  If n <= 1: Return 1
  Return n * Factorial(n-1)`,
    },
    complexity: { best: 'Ω(n)', worst: 'O(n)', average: 'Θ(n)' },
  },

  REC_SUBSETS: {
    name: 'Subsets (Backtracking)',
    code: {
      pseudo: `Algorithm Subsets(nums, index, curr):
  If index == nums.length:
    Add curr to Result; Return
  
  Add nums[index] to curr
  Subsets(nums, index + 1, curr)
  
  Remove nums[index] from curr
  Subsets(nums, index + 1, curr)`,
    },
    complexity: { best: 'Ω(2^n)', worst: 'O(2^n)', average: 'Θ(2^n)' },
  },
}
