/**
 * Idle Timer Utility
 *
 * Tracks user activity and triggers a callback after a specified period of inactivity.
 * Used to automatically log out users after being idle for too long.
 */

type IdleTimerOptions = {
  timeout: number // Idle timeout in milliseconds
  onIdle: () => void // Callback when user becomes idle
  onActive?: () => void // Optional callback when user becomes active again
  events?: string[] // DOM events to listen for activity
  idleMessage?: string // Message to show when user is about to be logged out
  warningTime?: number // Time before timeout to show warning (ms)
  onWarning?: () => void // Callback when warning time is reached
}

export default class IdleTimer {
  private timeout: number
  private onIdle: () => void
  private onActive?: () => void
  private onWarning?: () => void
  private warningTime: number
  private idleMessage: string
  private events: string[]
  private timer: number | null = null
  private warningTimer: number | null = null
  private isIdle = false
  private warningShown = false
  private modalElement: HTMLElement | null = null

  constructor(options: IdleTimerOptions) {
    this.timeout = options.timeout || 5 * 60 * 1000 // Default 5 minutes
    this.onIdle = options.onIdle
    this.onActive = options.onActive
    this.onWarning = options.onWarning
    this.warningTime = options.warningTime || 60 * 1000 // Default 1 minute warning
    this.idleMessage = options.idleMessage || 'Your session is about to expire due to inactivity.'
    this.events = options.events || [
      'mousedown',
      'mousemove',
      'keydown',
      'touchstart',
      'scroll',
      'click',
      'keypress',
      'load',
    ]

    // Bind the tracker method context to this class instance
    this.tracker = this.tracker.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  /**
   * Start tracking user activity
   */
  start(): void {
    // Clear any existing timers
    this.reset()

    // Add event listeners
    this.addEvents()

    // Start the timer
    this.resetTimer()
  }

  /**
   * Stop tracking user activity
   */
  stop(): void {
    this.removeEvents()
    this.clearTimers()
    this.hideWarningModal()
  }

  /**
   * Reset the timer (called when user is active)
   */
  resetTimer(): void {
    this.clearTimers()

    // Clear idle state if active
    if (this.isIdle) {
      this.isIdle = false
      if (this.onActive) this.onActive()
    }

    // Hide warning modal if shown
    if (this.warningShown) {
      this.hideWarningModal()
      this.warningShown = false
    }

    // Set warning timer
    if (this.warningTime && this.onWarning) {
      this.warningTimer = window.setTimeout(() => {
        this.showWarningModal()
        this.warningShown = true
        if (this.onWarning) this.onWarning()
      }, this.timeout - this.warningTime)
    }

    // Set idle timer
    this.timer = window.setTimeout(() => {
      this.isIdle = true
      this.hideWarningModal()
      this.onIdle()
    }, this.timeout)
  }

  /**
   * Clear all timers
   */
  clearTimers(): void {
    if (this.timer !== null) {
      window.clearTimeout(this.timer)
      this.timer = null
    }

    if (this.warningTimer !== null) {
      window.clearTimeout(this.warningTimer)
      this.warningTimer = null
    }
  }

  /**
   * Reset the entire timer
   */
  reset(): void {
    this.removeEvents()
    this.clearTimers()
    this.isIdle = false
    this.warningShown = false
    this.hideWarningModal()
  }

  /**
   * Event listener for user activity
   */
  tracker(): void {
    this.resetTimer()
  }

  /**
   * Add event listeners for user activity
   */
  addEvents(): void {
    this.events.forEach((event) => {
      window.addEventListener(event, this.tracker, { passive: true })
    })

    // Also track page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  /**
   * Remove event listeners
   */
  removeEvents(): void {
    this.events.forEach((event) => {
      window.removeEventListener(event, this.tracker)
    })

    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  /**
   * Handle visibility change (page focus/blur)
   */
  handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      // Page is visible again, check if we're past the idle time
      const idleTime = this.warningTime ? this.timeout - this.warningTime : this.timeout
      // If we're not already idle, reset the timer
      if (!this.isIdle) {
        this.resetTimer()
      }
    }
  }

  /**
   * Show warning modal
   */
  showWarningModal(): void {
    // Create modal if it doesn't exist
    if (!this.modalElement) {
      this.modalElement = document.createElement('div')
      this.modalElement.className = 'idle-timeout-modal'
      this.modalElement.style.position = 'fixed'
      this.modalElement.style.top = '0'
      this.modalElement.style.left = '0'
      this.modalElement.style.right = '0'
      this.modalElement.style.bottom = '0'
      this.modalElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      this.modalElement.style.display = 'flex'
      this.modalElement.style.alignItems = 'center'
      this.modalElement.style.justifyContent = 'center'
      this.modalElement.style.zIndex = '9999'

      const dialog = document.createElement('div')
      dialog.className = 'idle-timeout-dialog'
      dialog.style.backgroundColor = 'white'
      dialog.style.padding = '20px'
      dialog.style.borderRadius = '8px'
      dialog.style.maxWidth = '400px'
      dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)'

      const title = document.createElement('h3')
      title.textContent = 'Session Timeout Warning'
      title.style.marginTop = '0'
      title.style.color = '#e53935'

      const message = document.createElement('p')
      message.textContent = this.idleMessage
      message.style.marginBottom = '20px'

      const actionDiv = document.createElement('div')
      actionDiv.style.display = 'flex'
      actionDiv.style.justifyContent = 'flex-end'
      actionDiv.style.marginTop = '20px'

      const stayButton = document.createElement('button')
      stayButton.id = 'idle-timeout-stay'
      stayButton.textContent = 'Stay Logged In'
      stayButton.style.padding = '8px 16px'
      stayButton.style.backgroundColor = '#2196f3'
      stayButton.style.color = 'white'
      stayButton.style.border = 'none'
      stayButton.style.borderRadius = '4px'
      stayButton.style.cursor = 'pointer'

      actionDiv.appendChild(stayButton)
      dialog.appendChild(title)
      dialog.appendChild(message)
      dialog.appendChild(actionDiv)
      this.modalElement.appendChild(dialog)

      document.body.appendChild(this.modalElement)

      // Add event listener to stay button
      stayButton.addEventListener('click', (e) => {
        e.preventDefault()
        this.resetTimer()
      })
    } else {
      this.modalElement.style.display = 'flex'
    }
  }

  /**
   * Hide warning modal
   */
  hideWarningModal(): void {
    if (this.modalElement) {
      this.modalElement.style.display = 'none'
    }
  }
}
