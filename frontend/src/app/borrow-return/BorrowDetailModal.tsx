'use client'
import React from 'react'
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
  bookTitles: string[]
}

interface BorrowDetailModalProps {
  borrow: Borrow | null
  onClose: () => void
}

function BorrowDetailModal({ borrow, onClose }: BorrowDetailModalProps) {
  if (!borrow) return null

  const getStatusColor = (status: string) =>
    status === 'MUON' ? '#ef4444' : '#10b981'

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'Chưa có'

  return (
    <div className={modalStyles['modal-overlay']} onClick={onClose}>
      <div
        className={modalStyles['modal-content']}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 600 }}
      >
        <div className={modalStyles['modal-title-bar']}>
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
            <div className={modalStyles['detail-item']}>
              <label>Mã phiếu:</label>
              <span>PM-{borrow.id.toString().padStart(4, '0')}</span>
            </div>
            <div className={modalStyles['detail-item']}>
              <label>Người mượn:</label>
              <span>{borrow.userName}</span>
            </div>
            <div className={modalStyles['detail-item']}>
              <label>Ngày mượn:</label>
              <span>{formatDate(borrow.borrowDate)}</span>
            </div>
            <div className={modalStyles['detail-item']}>
              <label>Ngày hẹn trả:</label>
              <span>{formatDate(borrow.returnDate)}</span>
            </div>
            <div className={modalStyles['detail-item']}>
              <label>Ngày trả thực tế:</label>
              <span>{formatDate(borrow.actualReturnDate)}</span>
            </div>
            <div className={modalStyles['detail-item']}>
              <label>Trạng thái:</label>
              <span style={{ color: getStatusColor(borrow.status), fontWeight: 600 }}>
                {borrow.status === 'MUON' ? 'MƯỢN' : 'ĐÃ TRẢ'}
              </span>
            </div>
            <div className={modalStyles['detail-item']}>
              <label>Tổng số sách:</label>
              <span>{borrow.totalBooks}</span>
            </div>
            <div className={modalStyles['detail-item']}>
              <label>Tổng số lượng:</label>
              <span>{borrow.totalQuantity}</span>
            </div>
            <div className={modalStyles['detail-item']}>
              <label>Ngày tạo:</label>
              <span>{borrow.createdAt.substring(0, 10)}</span>
            </div>
          </div>

          {/* Danh sách sách mượn */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 12, color: '#374151' }}>
              Danh sách sách mượn:
            </h3>
            <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 4 }}>
              {borrow.bookTitles.length === 0 ? (
                <div style={{ padding: 12, color: '#6b7280' }}>Không có sách nào.</div>
              ) : (
                borrow.bookTitles.map((title, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 16px',
                      borderBottom: idx < borrow.bookTitles.length - 1 ? '1px solid #e5e7eb' : 'none',
                      fontSize: 15,
                      color: '#374151'
                    }}
                  >
                    {idx + 1}. {title}
                  </div>
                ))
              )}
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
