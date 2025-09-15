'use client'
import React, { useEffect, useState } from 'react'
import modalStyles from '../../styles/Form.module.css'

export type BookFormData = {
  id?: number
  title: string
  authorId: string
  categoryId: string
  publisherId: string
  yearPublished: number
  price: number
  quantity: number
  description: string
  language: string
}

type Option = {
  id: string | number
  name: string
}

const LANGUAGE_OPTIONS: Option[] = [
  { id: 'Tiếng Việt', name: 'Tiếng Việt' },
  { id: 'Tiếng Anh', name: 'Tiếng Anh' },
  { id: 'Tiếng Trung', name: 'Tiếng Trung' },
  { id: 'Tiếng Nhật', name: 'Tiếng Nhật' },
  { id: 'Tiếng Pháp', name: 'Tiếng Pháp' }
]

export default function BookForm({
  mode,
  book,
  onClose,
  onSuccess
}: {
  mode: 'add' | 'edit'
  book?: BookFormData
  onClose: () => void
  onSuccess: () => void
}) {
  const [authors, setAuthors] = useState<Option[]>([])
  const [categories, setCategories] = useState<Option[]>([])
  const [publishers, setPublishers] = useState<Option[]>([])

  const [form, setForm] = useState<BookFormData>({
    title: '',
    authorId: '',
    categoryId: '',
    publisherId: '',
    yearPublished: new Date().getFullYear(),
    price: 0,
    quantity: 1,
    description: '',
    language: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [authorRes, categoryRes, publisherRes] = await Promise.all([
          fetch('/api/authors', { credentials: 'include' }),
          fetch('/api/categories', { credentials: 'include' }),
          fetch('/api/publishers', { credentials: 'include' })
        ])
        const authorJson = await authorRes.json()
        const categoryJson = await categoryRes.json()
        const publisherJson = await publisherRes.json()
        setAuthors(
          Array.isArray(authorJson.data)
            ? authorJson.data.map((a: any) => ({ id: String(a.id), name: a.authorname }))
            : []
        )
        setCategories(
          Array.isArray(categoryJson.data)
            ? categoryJson.data.map((c: any) => ({ id: String(c.id), name: c.categoryname }))
            : []
        )
        setPublishers(
          Array.isArray(publisherJson.data)
            ? publisherJson.data.map((p: any) => ({ id: String(p.id), name: p.publisherName }))
            : []
        )
      } catch (err) {
        setAuthors([])
        setCategories([])
        setPublishers([])
      }
    }
    fetchOptions()
  }, [])

  // Set form state when options and book are ready
  useEffect(() => {
    if (
      mode === 'edit' &&
      book &&
      authors.length > 0 &&
      categories.length > 0 &&
      publishers.length > 0
    ) {
      // Map and convert id fields to string!
      setForm({
        id: book.id,
        title: book.title,
        authorId: book.authorId ? String(book.authorId) : '',
        categoryId: book.categoryId ? String(book.categoryId) : '',
        publisherId: book.publisherId ? String(book.publisherId) : '',
        yearPublished: book.yearPublished,
        price: book.price,
        quantity: book.quantity,
        description: book.description,
        language: book.language || ''
      })
    }
    if (mode === 'add') {
      setForm({
        title: '',
        authorId: '',
        categoryId: '',
        publisherId: '',
        yearPublished: new Date().getFullYear(),
        price: 0,
        quantity: 1,
        description: '',
        language: ''
      })
    }
  }, [book, mode, authors, categories, publishers])

  // Optional: Debug log
  useEffect(() => {
    if (mode === 'edit') {
      console.log('Book prop:', book)
      console.log('Authors:', authors)
      console.log('Categories:', categories)
      console.log('Publishers:', publishers)
      console.log('Form state:', form)
    }
  }, [form, book, authors, categories, publishers, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'yearPublished' ? Number(value) : value
    }))
  }

  const isEdit = mode === 'edit'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(mode === 'add' ? '/api/books' : `/api/books/${book?.id}`, {
        method: mode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      const json = await res.json()
      if (json.status) {
        onSuccess()
        onClose()
      } else {
        setError(json.userMessage || 'Lưu sách thất bại')
      }
    } catch {
      setError('Không thể kết nối server.')
    } finally {
      setLoading(false)
    }
  }

  const groupGap = 24 // px

  return (
    <div className={modalStyles['modal-overlay']}>
      <div className={modalStyles['modal-content']}>
        <div className={modalStyles['modal-title-bar']}>
          <div className={modalStyles['modal-title']}>{isEdit ? 'SỬA SÁCH' : 'THÊM SÁCH MỚI'}</div>
          <button type='button' className={modalStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ fontFamily: 'inherit' }}>
          {/* TÊN SÁCH */}
          <div className={modalStyles['form-group']} style={{ marginBottom: groupGap }}>
            <label className={modalStyles['form-label']}>
              Tên sách <span style={{ color: '#e53935' }}>*</span>
            </label>
            <input
              className={modalStyles['input']}
              name='title'
              value={form.title}
              onChange={handleChange}
              maxLength={255}
              required
              style={{ width: '100%' }}
              placeholder='Nhập tên sách...'
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: groupGap,
              marginBottom: groupGap,
              alignItems: 'start'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: groupGap }}>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Tác giả <span style={{ color: '#e53935' }}>*</span>
                </label>
                <select
                  className={modalStyles['input']}
                  name='authorId'
                  value={form.authorId}
                  onChange={handleChange}
                  required
                >
                  <option value=''>-- Chọn tác giả --</option>
                  {authors.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Thể loại <span style={{ color: '#e53935' }}>*</span>
                </label>
                <select
                  className={modalStyles['input']}
                  name='categoryId'
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value=''>-- Chọn thể loại --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Giá (VNĐ) <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  name='price'
                  type='number'
                  min={0}
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: groupGap }}>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Nhà xuất bản <span style={{ color: '#e53935' }}>*</span>
                </label>
                <select
                  className={modalStyles['input']}
                  name='publisherId'
                  value={form.publisherId}
                  onChange={handleChange}
                  required
                >
                  <option value=''>-- Chọn NXB --</option>
                  {publishers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Năm xuất bản <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  name='yearPublished'
                  type='number'
                  min={1900}
                  max={3000}
                  value={form.yearPublished}
                  onChange={handleChange}
                  required
                  placeholder='2024'
                />
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Số lượng <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  name='quantity'
                  type='number'
                  min={1}
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className={modalStyles['form-group']} style={{ marginBottom: groupGap }}>
            <label className={modalStyles['form-label']}>
              Ngôn ngữ <span style={{ color: '#e53935' }}>*</span>
            </label>
            <select
              className={modalStyles['input']}
              name='language'
              value={form.language}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            >
              <option value=''>-- Chọn ngôn ngữ --</option>
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className={modalStyles['form-group']} style={{ marginBottom: groupGap }}>
            <label className={modalStyles['form-label']} style={{ fontWeight: 500 }}>
              Mô tả
            </label>
            <textarea
              className={modalStyles['input']}
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: 16 }}
              placeholder='Nhập mô tả về nội dung, tác giả, và các thông tin khác về cuốn sách...'
            />
          </div>
          {error && <div className={modalStyles['error-message']}>{error}</div>}
          <div className={modalStyles['form-footer']}>
            <button
              type='button'
              className={modalStyles['btn-cancel']}
              onClick={onClose}
              disabled={loading}
              style={{ fontFamily: 'inherit' }}
            >
              Hủy bỏ
            </button>
            <button
              type='submit'
              className={modalStyles['btn-confirm']}
              disabled={loading}
              style={{ fontFamily: 'inherit' }}
            >
              {loading ? (isEdit ? 'Đang xác nhận...' : 'Đang xác nhận...') : isEdit ? 'Xác nhận' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
