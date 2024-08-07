import { create } from 'zustand';
import supabase from '@/utils/supabaseClient';
import { defaultTemplates } from '@/utils/promptTemplates';

const usePromptTemplateStore = create((set, get) => ({
  templates: [...defaultTemplates],
  isLoading: false,
  error: null,
  selectedTemplate: null,
  isModalOpen: false,
  isEditMode: false,

  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setIsEditMode: (isEdit) => set({ isEditMode: isEdit }),

  fetchTemplates: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const combinedTemplates = [...defaultTemplates, ...data];
      set({ templates: combinedTemplates, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTemplate: async (template) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .insert(template)
        .single();

      if (error) throw error;

      set((state) => ({
        templates: [data, ...state.templates],
        isLoading: false,
        isEditMode: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeTemplate: async (templateId) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .delete()
        .match({ id: templateId });

      if (error) throw error;

      set((state) => ({
        templates: state.templates.filter((t) => t.id !== templateId),
        isLoading: false,
        selectedTemplate: null,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateTemplate: async (templateId, updatedTemplate) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .update(updatedTemplate)
        .match({ id: templateId })
        .single();

      if (error) throw error;

      set((state) => ({
        templates: state.templates.map((t) =>
          t.id === templateId ? { ...t, ...data } : t
        ),
        isLoading: false,
        isEditMode: false,
        selectedTemplate: { ...data },
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default usePromptTemplateStore;