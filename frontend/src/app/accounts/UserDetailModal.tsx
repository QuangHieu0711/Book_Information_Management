import React from 'react'
import styles from '../../styles/Detail.module.css'

type UserDetailModalProps = {
  user: {
    username: string
    role: string
    fullName: string
    createdAt: string
  }
  onClose: () => void
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        {/* Header */}
        <div className={styles['modal-header']}>
          <span className={styles['modal-title']}>THÔNG TIN NGƯỜI DÙNG</span>
          <button className={styles['close-btn']} onClick={onClose}>×</button>
        </div>
        {/* Body */}
        <div className={styles['modal-body']}>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Tên đăng nhập:</span>
            <span className={styles['detail-value']}>{user.username}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Họ tên:</span>
            <span className={styles['detail-value']}>{user.fullName}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Vai trò:</span>
            <span className={styles['detail-value']}>{user.role === 'ADMIN' ? 'ADMIN' : 'USER'}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Ngày tạo:</span>
            <span className={styles['detail-value']}>{user.createdAt ? user.createdAt.substring(0, 10) : ''}</span>
          </div>
        </div>
        {/* Footer */}
        <div className={styles['modal-footer']}>
          <button className={styles['btn-close']} onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  )
}
