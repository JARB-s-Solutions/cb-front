// src/utils/dateUtils.js

export function formatTime(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return dateString
  }
}

export function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

export function formatDateTime(dateString) {
  return `${formatDate(dateString)} ${formatTime(dateString)}`
}

export function isToday(dateString) {
  try {
    const date = new Date(dateString)
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  } catch {
    return false
  }
}
