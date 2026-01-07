import { defineStore } from 'pinia'
import { ref } from 'vue'
import { recordsApi } from '@/services/api/records'
import type { Record } from '@/domain/types'

export const useRecordsStore = defineStore('records', () => {
  const records = ref<Record[]>([])
  const currentRecord = ref<Record | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRecords(params?: { profileId?: string; storeId?: string }) {
    try {
      loading.value = true
      error.value = null
      records.value = await recordsApi.list(params)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch records'
    } finally {
      loading.value = false
    }
  }

  async function fetchRecord(id: string) {
    try {
      loading.value = true
      error.value = null
      currentRecord.value = await recordsApi.get(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch record'
    } finally {
      loading.value = false
    }
  }

  async function createRecord(data: any) {
    try {
      loading.value = true
      error.value = null
      const record = await recordsApi.create(data)
      records.value.unshift(record)
      return record
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create record'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    records,
    currentRecord,
    loading,
    error,
    fetchRecords,
    fetchRecord,
    createRecord,
  }
})
