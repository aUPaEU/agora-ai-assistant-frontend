export const TOAST_TYPES = {
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info'
}

export const throwToast = (message, type) => {
    const toast = document.createElement('agora-toast')
    toast.wrapper.classList.add(type)
    toast.toastType = type
    toast.toastTitle = type.slice(0, 1).toUpperCase() + type.slice(1)
    toast.textContent = message
    document.body.appendChild(toast)
}