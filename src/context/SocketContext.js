import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'https://hireflow-api-sx9m.onrender.com'

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('register', user._id || user.id)
    })

    socket.on('statusUpdate', (data) => {
      toast.success(data.message || 'Application status updated')
      setNotifications((prev) => [{ ...data, id: Date.now(), read: false }, ...prev])
    })

    return () => {
      socket.disconnect()
    }
  }, [user])

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <SocketContext.Provider value={{ notifications, markAllRead }}>
      {children}
    </SocketContext.Provider>
  )
}