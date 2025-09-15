'use client'
import React from 'react'
import styles from '../../styles/Detail.module.css'

type Category = {
  id: number
  categoryname: string
  createdAt: string
}

type CategoryDetailModalProps = {
  category: Category
  onClose: () => void
}

export default function CategoryDetailModal({ category, onClose }: CategoryDetailModalProps) {
  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        {/* Header */}
        <div className={styles['modal-header']}>
          <span className={styles['modal-title']}>THÔNG TIN THỂ LOẠI</span>
          <button className={styles['close-btn']} onClick={onClose}>×</button>
        </div>
        {/* Body */}
        <div className={styles['modal-body']}>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>ID:</span>
            <span className={styles['detail-value']}>{category.id}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Tên thể loại:</span>
            <span className={styles['detail-value']}>{category.categoryname}</span>
          </div>
          <div className={styles['detail-row']}>
            <span className={styles['detail-label']}>Ngày tạo:</span>
            <span className={styles['detail-value']}>
              {category.createdAt ? category.createdAt.substring(0, 10) : ''}
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
