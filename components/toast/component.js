const SEVERITIES = {
  info: { label: 'Info', region: 'status', duration: 5000 },
  success: { label: 'Success', region: 'status', duration: 5000 },
  warning: { label: 'Warning', region: 'alert', duration: 0 },
  error: { label: 'Error', region: 'alert', duration: 0 },
};

// `root` must already contain the empty role="status" and role="alert" regions:
// screen readers only announce changes to live regions they already know about.
export function createToaster(root) {
  function show(message, { severity = 'info', duration } = {}) {
    const config = SEVERITIES[severity];
    const ms = duration ?? config.duration;
    let timer;
    let returnFocusTo = null;

    const toast = document.createElement('div');
    toast.className = `toast toast--${severity}`;

    const text = document.createElement('p');
    text.className = 'toast__text';
    const label = document.createElement('strong');
    label.textContent = `${config.label}: `;
    text.append(label, message);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'toast__dismiss';
    button.textContent = 'Dismiss';

    function startTimer() {
      clearTimeout(timer);
      if (ms > 0 && !toast.contains(document.activeElement)) timer = setTimeout(dismiss, ms);
    }

    function dismiss() {
      if (toast.contains(document.activeElement)) returnFocusTo?.focus();
      clearTimeout(timer);
      toast.remove();
    }

    button.addEventListener('click', dismiss);
    toast.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') dismiss();
    });

    // Pause while the user is reading or interacting (WCAG 2.2.1).
    toast.addEventListener('mouseenter', () => clearTimeout(timer));
    toast.addEventListener('mouseleave', startTimer);
    toast.addEventListener('focusin', (event) => {
      returnFocusTo ??= event.relatedTarget;
      clearTimeout(timer);
    });
    toast.addEventListener('focusout', startTimer);

    toast.append(text, button);
    root.querySelector(`[role="${config.region}"]`).append(toast);
    startTimer();
    return dismiss;
  }

  return { show };
}
