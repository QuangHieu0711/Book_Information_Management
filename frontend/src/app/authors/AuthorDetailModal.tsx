import React from 'react'
import styles from '../../styles/Detail.module.css'

type AuthorDetailModalProps = {
  author: {
    id: number
    authorname: string
    birthYear: number
    createdAt: string
    nationality: string
  }
  onClose: () => void
}

export default function AuthorDetailModal({ author, onClose }: AuthorDetailModalProps) {
  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        {/* Header */}
        <div className={styles['modal-header']}>
          <span className={styles['modal-title']}>THÔNG TIN TÁC GIẢ</span>
          <button className={styles['close-btn']} onClick={onClose}>×</button>
        </div>
        {/* Body */}
        <div className={styles['modal-body']}>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>ID:</span>
            <span className={styles['detail-value']}>{author.id}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Tên tác giả:</span>
            <span className={styles['detail-value']}>{author.authorname}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Năm sinh:</span>
            <span className={styles['detail-value']}>{author.birthYear}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Quốc tịch:</span>
            <span className={styles['detail-value']}>{author.nationality}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Ngày tạo:</span>
            <span className={styles['detail-value']}>
              {author.createdAt ? author.createdAt.substring(0, 10) : ''}
            </span>
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
