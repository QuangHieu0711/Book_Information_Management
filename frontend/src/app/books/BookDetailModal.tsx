'use client'
import React from 'react'
import styles from '../../styles/Detail.module.css'

type BookDetailModalProps = {
  book: {
    id: number
    title: string
    author: string
    category: string
    publisher: string
    yearPublished: number
    price: number
    quantity: number
    description: string
    language: string
    createdAt: string
  }
  onClose: () => void
}

export default function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']} style={{ maxWidth: 480, minWidth: 320 }}>
        {/* Header */}
        <div className={styles['modal-header']}>
          <span className={styles['modal-title']}>CHI TIẾT SÁCH</span>
          <button className={styles['close-btn']} onClick={onClose}>×</button>
        </div>
        {/* Body */}
        <div className={styles['modal-body']}>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>ID:</span>
            <span className={styles['detail-value']}>{book.id}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Tên sách:</span>
            <span className={styles['detail-value']}>{book.title}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Tác giả:</span>
            <span className={styles['detail-value']}>{book.author}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Thể loại:</span>
            <span className={styles['detail-value']}>{book.category}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Nhà xuất bản:</span>
            <span className={styles['detail-value']}>{book.publisher}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Năm XB:</span>
            <span className={styles['detail-value']}>{book.yearPublished}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Giá:</span>
            <span className={styles['detail-value']}>{book.price.toLocaleString()}₫</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Số lượng:</span>
            <span className={styles['detail-value']}>{book.quantity}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Ngôn ngữ:</span>
            <span className={styles['detail-value']}>{book.language}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Ngày tạo:</span>
            <span className={styles['detail-value']}>
              {book.createdAt ? book.createdAt.substring(0, 10) : ''}
            </span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Mô tả:</span>
            <span className={styles['detail-value']} style={{ whiteSpace: 'pre-line' }}>{book.description}</span>
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
