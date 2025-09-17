'use client'
import DashboardLayout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import listStyles from '../../styles/List.module.css'
import deleteModalStyles from '../../styles/DeleteModal.module.css'
import PublisherForm, { PublisherEditForm } from './PublisherForm'
import PublisherDetailModal from './PublisherDetailModal'
import Toast from '../../components/Toast'

function DeletePublisherModal({
  publisherName,
  onClose,
  onConfirm,
  loading
}: {
  publisherName: string
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
          Bạn có chắc chắn muốn xóa nhà xuất bản <b>{publisherName}</b>?
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

type Publisher = {
  id: number
  publisherName: string
  address: string
  phone: string
  email: string
  website: string
  isActive: boolean
  createdAt: string
}

const PAGE_SIZE = 8

function PublisherListContent() {
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // State cho modal form
  const [showAdd, setShowAdd] = useState(false)
  const [editPublisher, setEditPublisher] = useState<PublisherEditForm | null>(null)
  const [viewPublisher, setViewPublisher] = useState<Publisher | null>(null)

  // State cho modal xóa
  const [deletePublisher, setDeletePublisher] = useState<Publisher | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Thông báo thành công
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)

  // Lấy danh sách publisher
  const fetchPublishers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/publishers', { credentials: 'include' })
      const json = await res.json()
      if (json.status && Array.isArray(json.data)) {
        setPublishers(json.data)
      } else {
        setError(json.userMessage || 'Lỗi lấy danh sách nhà xuất bản')
      }
    } catch (err) {
      setError('Không thể kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublishers()
  }, [])

  // Sắp xếp theo thời gian tạo (createdAt) mới nhất lên đầu
  const sortedPublishers = [...publishers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Filter publishers by name, address, phone, email, website
  const filtered = sortedPublishers.filter(
    p =>
      p.publisherName.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.toLowerCase().includes(search.toLowerCase()) ||
      p.website.toLowerCase().includes(search.toLowerCase())
  )

  // Paging
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedPublishers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleView = (publisher: Publisher) => {
    setViewPublisher(publisher)
  }

  const handleEdit = (publisher: Publisher) => {
    setEditPublisher({
      id: publisher.id,
      publisherName: publisher.publisherName,
      address: publisher.address,
      phone: publisher.phone,
      email: publisher.email,
      website: publisher.website,
      isActive: publisher.isActive
    })
  }

  const handleDeleteClick = (publisher: Publisher) => {
    setDeletePublisher(publisher)
  }

  const handleDeleteConfirm = async () => {
    if (!deletePublisher) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/publishers/${deletePublisher.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.status) {
        setDeletePublisher(null)
        fetchPublishers()
        setToast({ message: 'Xóa nhà xuất bản thành công', type: 'success' })
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

  // callback cho PublisherForm
  const handleSuccess = (msg: string) => {
    fetchPublishers()
    setToast({ message: msg, type: 'success' })
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div className={listStyles['list-container']}>
      <div className={listStyles['list-toolbar']}>
        <button className={listStyles['list-add-btn']} onClick={() => setShowAdd(true)}>
          + Thêm nhà xuất bản
        </button>
        <input
          type='text'
          className={listStyles['list-search']}
          placeholder='Tìm kiếm tên, địa chỉ, email, website...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className={listStyles['list-table']}>
        <thead>
          <tr>
            <th className={listStyles['stt-header']}>STT</th>
            <th>Tên NXB</th>
            <th className={listStyles['address-col']}>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Website</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedPublishers.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: 24 }}>
                Không có nhà xuất bản nào.
              </td>
            </tr>
          ) : (
            pagedPublishers.map((p, idx) => (
              <tr key={p.id}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{p.publisherName}</td>
                <td>{p.address}</td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td>{p.website}</td>
                <td>
                  <span style={{ color: p.isActive ? '#059669' : '#d97706', fontWeight: 500 }}>
                    {p.isActive ? 'Hoạt động' : 'Ngưng'}
                  </span>
                </td>
                <td>{p.createdAt ? p.createdAt.substring(0, 10) : ''}</td>
                <td>
                  <button className={listStyles['list-action-btn']} title='Xem' onClick={() => handleView(p)}>
                    <FaEye color='#2563eb' />
                  </button>
                  <button className={listStyles['list-action-btn']} title='Sửa' onClick={() => handleEdit(p)}>
                    <FaEdit color='#f59e42' />
                  </button>
                  <button className={listStyles['list-action-btn']} title='Xóa' onClick={() => handleDeleteClick(p)}>
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
        <PublisherForm
          mode='add'
          onClose={() => setShowAdd(false)}
          onSuccess={() => handleSuccess('Thêm nhà xuất bản thành công')}
        />
      )}
      {editPublisher && (
        <PublisherForm
          mode='edit'
          publisher={editPublisher}
          onClose={() => setEditPublisher(null)}
          onSuccess={() => handleSuccess('Cập nhật nhà xuất bản thành công')}
        />
      )}
      {deletePublisher && (
        <DeletePublisherModal
          publisherName={deletePublisher.publisherName}
          loading={deleteLoading}
          onClose={() => setDeletePublisher(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {viewPublisher && <PublisherDetailModal publisher={viewPublisher} onClose={() => setViewPublisher(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default function PublisherListPage() {
  return (
    <DashboardLayout>
      <PublisherListContent />
    </DashboardLayout>
  )
}
