const Toast = ({ toasts, onClose }) => {
  const getToastStyles = (type) => {
    switch(type) {
      case 'success':
        return 'from-green-500 to-emerald-500'
      case 'error':
        return 'from-red-500 to-pink-500'
      default:
        return 'from-blue-500 to-cyan-500'
    }
  }

  const getIcon = (type) => {
    switch(type) {
      case 'success':
        return 'fa-check-circle'
      case 'error':
        return 'fa-exclamation-circle'
      default:
        return 'fa-info-circle'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center space-x-3 bg-gradient-to-r ${getToastStyles(toast.type)} text-white rounded-xl shadow-2xl p-4 min-w-[300px] max-w-md animate-in slide-in-from-right duration-300`}
        >
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className={`fas ${getIcon(toast.type)} text-xl`}></i>
          </div>
          <span className="flex-1 font-medium">{toast.message}</span>
          <button
            onClick={() => onClose(toast.id)}
            className="hover:bg-white/20 rounded-lg p-2 transition-colors duration-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
