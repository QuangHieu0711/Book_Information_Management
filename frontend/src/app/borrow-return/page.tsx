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
  loading,
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
          <button type="button" className={deleteModalStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={{ margin: '24px 0', fontSize: 16 }}>
          Bạn có chắc chắn muốn xóa phiếu mượn <b>{borrowInfo}</b>?
        </div>
        <div className={deleteModalStyles['form-footer']}>
          <button type="button" onClick={onClose} className={deleteModalStyles['btn-cancel']}>
            Hủy bỏ
          </button>
          <button
            type="button"
            className={deleteModalStyles['btn-confirm']}
            disabled={loading}
            onClick={onConfirm}
          >
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
  userName: string
  userId: number
  borrowDate: string
  returnDate: string
  actualReturnDate: string
  status: string // "MUON", "DA TRA"
  createdAt: string
  totalBooks: number // Tổng số sách trong phiếu
  totalQuantity: number // Tổng số lượng mượn
  bookTitles: string[] // Danh sách tên sách ngắn gọn
}

const PAGE_SIZE = 10

function BorrowListContent() {
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // State cho modal form
  const [showAdd, setShowAdd] = useState(false)
  const [editBorrow, setEditBorrow] = useState<BorrowFormData | null>(null)
  const [viewBorrow, setViewBorrow] = useState<Borrow | null>(null)

  // State cho modal xóa
  const [deleteBorrow, setDeleteBorrow] = useState<Borrow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Thông báo thành công
  const [toast, setToast] = useState<{ message: string, type?: 'success' | 'error' } | null>(null)

  // Lấy danh sách phiếu mượn
  const fetchBorrows = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/borrow-return/borrows', { credentials: 'include' })
      const json = await res.json()
      if (json.status && Array.isArray(json.data)) {
        setBorrows(json.data)
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
  const sortedBorrows = [...borrows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Filter borrows by user name, status, book titles
  const filtered = sortedBorrows.filter(borrow =>
    borrow.userName.toLowerCase().includes(search.toLowerCase()) ||
    borrow.status.toLowerCase().includes(search.toLowerCase()) ||
    borrow.bookTitles.some(title => 
      title.toLowerCase().includes(search.toLowerCase())
    )
  )

  // Paging
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedBorrows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleView = (borrow: Borrow) => {
    setViewBorrow(borrow)
  }

  const handleEdit = (borrow: Borrow) => {
    setEditBorrow({
      id: borrow.id,
      userId: String(borrow.userId),
      borrowDate: borrow.borrowDate,
      returnDate: borrow.returnDate,
      status: borrow.status,
    })
  }

  const handleDeleteClick = (borrow: Borrow) => {
    setDeleteBorrow(borrow)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteBorrow) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/borrows/${deleteBorrow.id}`, { 
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
  }, [search])

  const handleSuccess = (msg: string) => {
    fetchBorrows()
    setToast({ message: msg, type: 'success' })
  }

  // Format status
  const getStatusBadge = (status: string) => {
    const badgeClass = status === 'MUON' 
      ? listStyles['status-muon'] 
      : listStyles['status-da-tra']
    const badgeText = status === 'MUON' ? 'MƯỢN' : 'ĐÃ TRẢ'
    return <span className={badgeClass}>{badgeText}</span>
  }

  // Format date
  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString('vi-VN') : ''
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div className={listStyles['list-container']}>
      <div className={listStyles['list-toolbar']}>
        <button className={listStyles['list-add-btn']} onClick={() => setShowAdd(true)}>
          + Thêm phiếu mượn
        </button>
        <input
          type="text"
          className={listStyles['list-search']}
          placeholder="Tìm kiếm theo tên người mượn, trạng thái, sách..."
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
            <th>Sách mượn</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedBorrows.length === 0 ? (
            <tr>
              <td colSpan={12} style={{ textAlign: 'center', padding: 24 }}>
                Không có phiếu mượn nào.
              </td>
            </tr>
          ) : (
            pagedBorrows.map((b, idx) => (
              <tr key={b.id}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>PM-{b.id.toString().padStart(4, '0')}</td>
                <td>{b.userName}</td>
                <td>{formatDate(b.borrowDate)}</td>
                <td>{formatDate(b.returnDate)}</td>
                <td>{formatDate(b.actualReturnDate)}</td>
                <td>{getStatusBadge(b.status)}</td>
                <td>{b.totalBooks}</td>
                <td>{b.totalQuantity}</td>
                <td>
                  <div style={{ maxWidth: 200, overflow: 'hidden' }}>
                    {b.bookTitles.map((title, i) => (
                      <div key={i} style={{ fontSize: 14, color: '#64748b' }}>
                        • {title}
                      </div>
                    ))}
                  </div>
                </td>
                <td>{b.createdAt ? b.createdAt.substring(0, 10) : ''}</td>
                <td>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Xem"
                    onClick={() => handleView(b)}
                  >
                    <FaEye color="#2563eb" />
                  </button>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Sửa"
                    onClick={() => handleEdit(b)}
                  >
                    <FaEdit color="#f59e42" />
                  </button>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Xóa"
                    onClick={() => handleDeleteClick(b)}
                  >
                    <FaTrash color="#ef4444" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className={listStyles['list-pagination']}>
        <button
          className={listStyles['list-pagination-btn']}
          onClick={handlePrevPage}
          disabled={page === 1}
        >
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
          mode="add"
          onClose={() => setShowAdd(false)}
          onSuccess={() => handleSuccess('Thêm phiếu mượn thành công')}
        />
      )}
      {editBorrow && (
        <BorrowForm
          mode="edit"
          borrow={editBorrow}
          onClose={() => setEditBorrow(null)}
          onSuccess={() => handleSuccess('Cập nhật phiếu mượn thành công')}
        />
      )}
      {deleteBorrow && (
        <DeleteBorrowModal
          borrowInfo={`PM-${deleteBorrow.id} - ${deleteBorrow.userName}`}
          loading={deleteLoading}
          onClose={() => setDeleteBorrow(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {viewBorrow && (
        <BorrowDetailModal
          borrow={viewBorrow}
          onClose={() => setViewBorrow(null)}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
