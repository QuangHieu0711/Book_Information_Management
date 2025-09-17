'use client'
import React, { useEffect, useState } from 'react'
import modalStyles from '../../styles/Detail.module.css'

type Borrow = {
  id: number
  userName: string
  userId: number
  borrowDate: string
  returnDate: string
  actualReturnDate: string
  status: string // "MUON", "DA TRA"
  createdAt: string
  totalBooks: number
  totalQuantity: number
  borrowDetails: {
    bookId: number
    quantity: number
  }[]
}

type Book = {
  id: number
  title: string
}

interface BorrowDetailModalProps {
  borrow: Borrow | null
  onClose: () => void
}

function BorrowDetailModal({ borrow, onClose }: BorrowDetailModalProps) {
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    fetch('/api/books', { credentials: 'include' })
      .then(res => res.json())
      .then(json => {
        if (json.status && Array.isArray(json.data)) {
          setBooks(json.data)
        }
      })
      .catch(() => {})
  }, [borrow])

  if (!borrow) return null

  const getStatusColor = (status: string) =>
    status === 'MUON' ? '#ef4444' : '#10b981'

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'Chưa có'

  // Chuyển bookId sang title
  const getBookTitle = (bookId: number) => {
    const found = books.find(b => b.id === bookId)
    return found ? found.title : `ID ${bookId}`
  }

  return (
    <div className={modalStyles['modal-overlay']} onClick={onClose}>
      <div
        className={modalStyles['modal-content']}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 600, minWidth: 370, width: '100%' }}
      >
        <div className={modalStyles['modal-header']}>
          <div className={modalStyles['modal-title']}>CHI TIẾT PHIẾU MƯỢN</div>
          <button
            type="button"
            className={modalStyles['close-btn']}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className={modalStyles['modal-body']}>
          <div className={modalStyles['detail-grid']}>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Mã phiếu:</span>
              <span className={modalStyles['detail-value']}>PM-{borrow.id.toString().padStart(4, '0')}</span>
            </div>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Người mượn:</span>
              <span className={modalStyles['detail-value']}>{borrow.userName}</span>
            </div>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Ngày mượn:</span>
              <span className={modalStyles['detail-value']}>{formatDate(borrow.borrowDate)}</span>
            </div>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Ngày hẹn trả:</span>
              <span className={modalStyles['detail-value']}>{formatDate(borrow.returnDate)}</span>
            </div>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Ngày trả thực tế:</span>
              <span className={modalStyles['detail-value']}>{formatDate(borrow.actualReturnDate)}</span>
            </div>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Trạng thái:</span>
              <span className={modalStyles['detail-value']} style={{ color: getStatusColor(borrow.status), fontWeight: 600 }}>
                {borrow.status === 'MUON' ? 'MƯỢN' : 'ĐÃ TRẢ'}
              </span>
            </div>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Tổng số sách:</span>
              <span className={modalStyles['detail-value']}>{borrow.totalBooks}</span>
            </div>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Tổng số lượng:</span>
              <span className={modalStyles['detail-value']}>{borrow.totalQuantity}</span>
            </div>
            <div className={modalStyles['detail-row']}>
              <span className={modalStyles['detail-label']}>Ngày tạo:</span>
              <span className={modalStyles['detail-value']}>{borrow.createdAt.substring(0, 10)}</span>
            </div>
          </div>

          {/* Danh sách sách mượn */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 12, color: '#374151' }}>
              Danh sách sách mượn:
            </h3>
            <div className={modalStyles['borrow-table-container']}>
            <table className={modalStyles['borrow-table']}>
                <thead>
                <tr>
                    <th >STT</th>
                    <th>Tên sách</th>
                    <th style={{ textAlign: 'center' }}>Số lượng</th>
                </tr>
                </thead>
                <tbody>
                {borrow.borrowDetails && borrow.borrowDetails.length > 0 ? (
                    borrow.borrowDetails.map((item, idx) => (
                    <tr key={idx}>
                        <td >{idx + 1}</td>
                        <td>{getBookTitle(item.bookId)}</td>
                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={3} style={{ padding: 12, color: '#6b7280', textAlign: 'center' }}>Không có sách nào.</td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
          </div>
        </div>
        <div className={modalStyles['modal-footer']}>
          <button
            type="button"
            onClick={onClose}
            className={modalStyles['btn-close']}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default BorrowDetailModal
