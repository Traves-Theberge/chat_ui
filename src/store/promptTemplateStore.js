import { create } from 'zustand';
import supabase from '@/utils/supabaseClient';
import { defaultTemplates } from '@/utils/promptTemplates';

const usePromptTemplateStore = create((set, get) => ({
  templates: [...defaultTemplates],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Combine default templates with fetched templates
      const combinedTemplates = [...defaultTemplates, ...data];
      set({ templates: combinedTemplates, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTemplate: async (template) => {
    const { data, error } = await supabase
      .from('prompt_templates')
      .insert(template)
      .single();

    if (error) {
      set({ error: error.message });
    } else {
      set((state) => ({ templates: [data, ...state.templates] }));
    }
  },

  removeTemplate: async (templateId) => {
    const { error } = await supabase
      .from('prompt_templates')
      .delete()
      .match({ id: templateId });

    if (error) {
      set({ error: error.message });
    } else {
      set((state) => ({
        templates: state.templates.filter((t) => t.id !== templateId),
      }));
    }
  },

  updateTemplate: async (templateId, updatedTemplate) => {
    const { data, error } = await supabase
      .from('prompt_templates')
      .update(updatedTemplate)
      .match({ id: templateId })
      .single();

    if (error) {
      set({ error: error.message });
    } else {
      set((state) => ({
        templates: state.templates.map((t) =>
          t.id === templateId ? { ...t, ...data } : t
        ),
      }));
    }
  },
}));

export default usePromptTemplateStore;