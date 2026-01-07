import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profilesApi } from '@/services/api/profiles'
import type { Profile } from '@/domain/types'

export const useProfileStore = defineStore('profile', () => {
  const profiles = ref<Profile[]>([])
  const currentProfile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProfiles(params?: { storeId?: string; search?: string }) {
    try {
      loading.value = true
      error.value = null
      profiles.value = await profilesApi.list(params)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch profiles'
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile(id: string) {
    try {
      loading.value = true
      error.value = null
      currentProfile.value = await profilesApi.get(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch profile'
    } finally {
      loading.value = false
    }
  }

  async function createProfile(data: any) {
    try {
      loading.value = true
      error.value = null
      const profile = await profilesApi.create(data)
      profiles.value.push(profile)
      return profile
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create profile'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: any) {
    try {
      loading.value = true
      error.value = null
      const profile = await profilesApi.update(data)
      const index = profiles.value.findIndex((p) => p.id === profile.id)
      if (index !== -1) {
        profiles.value[index] = profile
      }
      if (currentProfile.value?.id === profile.id) {
        currentProfile.value = profile
      }
      return profile
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update profile'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    profiles,
    currentProfile,
    loading,
    error,
    fetchProfiles,
    fetchProfile,
    createProfile,
    updateProfile,
  }
})
