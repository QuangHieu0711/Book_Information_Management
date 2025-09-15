import React from 'react'
import styles from '../../styles/Detail.module.css'

type PublisherDetailModalProps = {
  publisher: {
    id: number
    publisherName: string
    address: string
    phone: string
    email: string
    website: string
    isActive: boolean
    createdAt: string
  }
  onClose: () => void
}

export default function PublisherDetailModal({ publisher, onClose }: PublisherDetailModalProps) {
  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        {/* Header */}
        <div className={styles['modal-header']}>
          <span className={styles['modal-title']}>THÔNG TIN NHÀ XUẤT BẢN</span>
          <button className={styles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        {/* Body */}
        <div className={styles['modal-body']}>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>ID:</span>
            <span className={styles['detail-value']}>{publisher.id}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Tên NXB:</span>
            <span className={styles['detail-value']}>{publisher.publisherName}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Địa chỉ:</span>
            <span className={styles['detail-value']}>{publisher.address}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Điện thoại:</span>
            <span className={styles['detail-value']}>{publisher.phone}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Email:</span>
            <span className={styles['detail-value']}>{publisher.email}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Website:</span>
            <span className={styles['detail-value']}>{publisher.website}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Trạng thái:</span>
            <span className={styles['detail-value']}>
              {publisher.isActive ? (
                <span style={{ color: '#059669', fontWeight: 500 }}>Hoạt động</span>
              ) : (
                <span style={{ color: '#d97706', fontWeight: 500 }}>Ngưng</span>
              )}
            </span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Ngày tạo:</span>
            <span className={styles['detail-value']}>
              {publisher.createdAt ? publisher.createdAt.substring(0, 10) : ''}
            </span>
          </div>
        </div>
        {/* Footer */}
        <div className={styles['modal-footer']}>
          <button className={styles['btn-close']} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
