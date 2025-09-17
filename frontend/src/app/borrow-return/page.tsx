'use client'
import DashboardLayout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import listStyles from '../../styles/List.module.css'
import deleteModalStyles from '../../styles/DeleteModal.module.css'
import BorrowForm, { BorrowFormData } from './BorrowForm'
import BorrowDetailModal from './BorrowDetailModal'
import Toast from '../../components/Toast'

function DeleteBorrowModal({
  borrowInfo,
  onClose,
  onConfirm,
  loading
}: {
  borrowInfo: string
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}) {
  return (
    <div className={deleteModalStyles['modal-overlay']}>
      <div className={deleteModalStyles['modal-content']} style={{ maxWidth: 380, minWidth: 300 }}>
        <div className={deleteModalStyles['modal-title-bar']}>
          <div className={deleteModalStyles['modal-title']}>XÁC NHẬN XÓA</div>
          <button type='button' className={deleteModalStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={{ margin: '24px 0', fontSize: 16 }}>
          Bạn có chắc chắn muốn xóa phiếu mượn <b>{borrowInfo}</b>?
        </div>
        <div className={deleteModalStyles['form-footer']}>
          <button type='button' onClick={onClose} className={deleteModalStyles['btn-cancel']}>
            Hủy bỏ
          </button>
          <button type='button' className={deleteModalStyles['btn-confirm']} disabled={loading} onClick={onConfirm}>
            {loading ? 'Đang xóa...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Kiểu dữ liệu trả về từ API /api/borrows (đã resolve thông tin user và chi tiết)
type Borrow = {
  id: number
  fullName: string
  userId: number
  borrowDate: string
  returnDate: string
  actualReturnDate: string
  status: string // "MUON", "DA TRA"
  createdAt: string
  details: {
    id: number
    borrowId: number
    bookId: number
    quantity: number
  }[]
}

type BorrowWithComputedFields = Borrow & {
  totalBooks: number
  totalQuantity: number
  bookTitles: string[]
}

const PAGE_SIZE = 14

function BorrowListContent() {
  const [borrows, setBorrows] = useState<BorrowWithComputedFields[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('Tất cả') // Thêm trạng thái lọc
  const [returnDateFilter, setReturnDateFilter] = useState('') // Thêm ngày hẹn trả lọc

  // State cho modal form
  const [showAdd, setShowAdd] = useState(false)
  const [editBorrow, setEditBorrow] = useState<BorrowFormData | null>(null)
  const [viewBorrow, setViewBorrow] = useState<BorrowWithComputedFields | null>(null)

  // State cho modal xóa
  const [deleteBorrow, setDeleteBorrow] = useState<BorrowWithComputedFields | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Thông báo thành công
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)

  // Lấy danh sách phiếu mượn
  const fetchBorrows = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/borrow-return/borrows', { credentials: 'include' })
      const json = await res.json()
      if (json.status && Array.isArray(json.data)) {
        const processedBorrows = json.data.map((borrow: Borrow) => {
          const totalBooks = borrow.details.length
          const totalQuantity = borrow.details.reduce((sum, detail) => sum + detail.quantity, 0)
          const bookTitles = borrow.details.map(detail => `Sách ID ${detail.bookId}`)
          return {
            ...borrow,
            totalBooks,
            totalQuantity,
            bookTitles
          }
        })
        setBorrows(processedBorrows)
      } else {
        setError(json.userMessage || 'Lỗi lấy danh sách phiếu mượn')
      }
    } catch (err) {
      setError('Không thể kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBorrows()
  }, [])

  // Sắp xếp theo thời gian tạo (createdAt) mới nhất lên đầu
  const sortedBorrows = [...borrows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Lọc theo trạng thái, ngày hẹn trả, và tìm kiếm
  const filtered = sortedBorrows.filter(borrow => {
    const fullName = borrow.fullName?.toLowerCase() ?? ''
    const status = borrow.status?.toLowerCase() ?? ''
    const searchLower = search.toLowerCase()
    const returnDateMatch = returnDateFilter ? borrow.returnDate === returnDateFilter : true
    const statusMatch =
      statusFilter === 'Tất cả' ? true : status === statusFilter.toLowerCase().replace('đã trả', 'da tra')
    return (
      returnDateMatch &&
      statusMatch &&
      (fullName.includes(searchLower) ||
        status.includes(searchLower) ||
        (borrow.bookTitles?.some(title => (title?.toLowerCase() ?? '').includes(searchLower)) ?? false))
    )
  })

  // Paging
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedBorrows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleView = (borrow: BorrowWithComputedFields) => {
    setViewBorrow(borrow)
  }

  const handleEdit = (borrow: BorrowWithComputedFields) => {
    setEditBorrow({
      id: borrow.id,
      userId: String(borrow.userId),
      borrowDate: borrow.borrowDate,
      returnDate: borrow.returnDate,
      status: borrow.status || ''
    })
  }

  const handleDeleteClick = (borrow: BorrowWithComputedFields) => {
    setDeleteBorrow(borrow)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteBorrow) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/borrow-return/borrows/${deleteBorrow.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const json = await res.json()
      if (json.status) {
        setDeleteBorrow(null)
        fetchBorrows()
        setToast({ message: 'Xóa phiếu mượn thành công', type: 'success' })
      } else {
        setToast({ message: json.userMessage || 'Xóa thất bại', type: 'error' })
      }
    } catch {
      setToast({ message: 'Lỗi mạng hoặc server', type: 'error' })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1))
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1))

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, returnDateFilter])

  const handleSuccess = (msg: string) => {
    fetchBorrows()
    setToast({ message: msg, type: 'success' })
  }

  // Format status badge with custom colors
  const getStatusBadge = (status: string) => {
    const badgeClass =
      status === 'MUON'
        ? `${listStyles['status-badge']} ${listStyles['status-muon']}`
        : `${listStyles['status-badge']} ${listStyles['status-da-tra']}`
    const badgeText = status === 'MUON' ? 'MƯỢN' : 'ĐÃ TRẢ'
    return (
      <span className={badgeClass} style={{ padding: '4px 8px', borderRadius: '12px' }}>
        {badgeText}
      </span>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString('vi-VN') : ''
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div className={listStyles['list-container']}>
      <div
        className={listStyles['list-toolbar']}
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}
      >
        <button className={listStyles['list-add-btn']} onClick={() => setShowAdd(true)}>
          + Thêm phiếu mượn
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor='statusFilter' style={{ minWidth: 85, textAlign: 'right' }}>
            Trạng thái:
          </label>
          <select
            id='statusFilter'
            className={listStyles['list-filter']}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              minWidth: 110
            }}
          >
            <option value='Tất cả'>Tất cả</option>
            <option value='MƯỢN'>Mượn</option>
            <option value='ĐÃ TRẢ'>Đã trả</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor='returnDateFilter' style={{ minWidth: 100, textAlign: 'right' }}>
            Ngày hẹn trả:
          </label>
          <input
            type='date'
            id='returnDateFilter'
            className={listStyles['list-date-filter']}
            value={returnDateFilter}
            onChange={e => setReturnDateFilter(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              minWidth: 140
            }}
          />
        </div>

        <input
          type='text'
          className={listStyles['list-search']}
          placeholder='Tìm kiếm theo tên người mượn, trạng thái, sách...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <table className={listStyles['list-table']}>
        <thead>
          <tr>
            <th className={listStyles['stt-header']}>STT</th>
            <th>Mã phiếu</th>
            <th>Người mượn</th>
            <th>Ngày mượn</th>
            <th>Ngày hẹn trả</th>
            <th>Ngày trả thực tế</th>
            <th>Trạng thái</th>
            <th>Số sách</th>
            <th>Tổng số lượng</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedBorrows.length === 0 ? (
            <tr>
              <td colSpan={11} style={{ textAlign: 'center', padding: '24px' }}>
                Không có phiếu mượn nào.
              </td>
            </tr>
          ) : (
            pagedBorrows.map((b, idx) => (
              <tr key={b.id}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>PM-{b.id.toString().padStart(4, '0')}</td>
                <td>{b.fullName}</td>
                <td>{formatDate(b.borrowDate)}</td>
                <td>{formatDate(b.returnDate)}</td>
                <td>{formatDate(b.actualReturnDate)}</td>
                <td>{getStatusBadge(b.status)}</td>
                <td>{b.totalBooks}</td>
                <td>{b.totalQuantity}</td>
                <td>{b.createdAt ? b.createdAt.substring(0, 10) : ''}</td>
                <td>
                  <button className={listStyles['list-action-btn']} title='Xem' onClick={() => handleView(b)}>
                    <FaEye color='#2563eb' />
                  </button>
                  <button className={listStyles['list-action-btn']} title='Sửa' onClick={() => handleEdit(b)}>
                    <FaEdit color='#f59e42' />
                  </button>
                  <button className={listStyles['list-action-btn']} title='Xóa' onClick={() => handleDeleteClick(b)}>
                    <FaTrash color='#ef4444' />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className={listStyles['list-pagination']}>
        <button className={listStyles['list-pagination-btn']} onClick={handlePrevPage} disabled={page === 1}>
          Trang trước
        </button>
        <span className={listStyles['list-pagination-info']}>
          Trang {page}/{totalPages || 1}
        </span>
        <button
          className={listStyles['list-pagination-btn']}
          onClick={handleNextPage}
          disabled={page === totalPages || totalPages === 0}
        >
          Trang sau
        </button>
      </div>
      {/* Modal form */}
      {showAdd && (
        <BorrowForm
          mode='add'
          onClose={() => setShowAdd(false)}
          onSuccess={() => handleSuccess('Thêm phiếu mượn thành công')}
        />
      )}
      {editBorrow && (
        <BorrowForm
          mode='edit'
          borrow={editBorrow}
          onClose={() => setEditBorrow(null)}
          onSuccess={() => handleSuccess('Cập nhật phiếu mượn thành công')}
        />
      )}
      {deleteBorrow && (
        <DeleteBorrowModal
          borrowInfo={`PM-${deleteBorrow.id} - ${deleteBorrow.fullName}`}
          loading={deleteLoading}
          onClose={() => setDeleteBorrow(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {viewBorrow && (
        <BorrowDetailModal
          borrow={{
            ...viewBorrow,
            userName: viewBorrow.fullName,
            borrowDetails: viewBorrow.details // Add this line to fix the missing property
          }}
          onClose={() => setViewBorrow(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default function BorrowListPage() {
  return (
    <DashboardLayout>
      <BorrowListContent />
    </DashboardLayout>
  )
}
