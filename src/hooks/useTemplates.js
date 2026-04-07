import { useCallback, useEffect, useState } from 'react';
import { whatsappCloudService } from '../services/whatsappCloudService';
import { parseApiError } from '../utils/parseApiError';
import { normalizeTemplatesResponse } from '../utils/whatsappTemplates';

let templatesCache = null;
let inFlightPromise = null;

export function useTemplates() {
  const [templates, setTemplates] = useState(Array.isArray(templatesCache) ? templatesCache : []);
  const [isLoading, setIsLoading] = useState(!Array.isArray(templatesCache));
  const [error, setError] = useState('');

  const fetchTemplates = useCallback(async ({ force = false } = {}) => {
    if (!force && Array.isArray(templatesCache)) {
      setTemplates(templatesCache);
      setError('');
      setIsLoading(false);
      return templatesCache;
    }

    if (inFlightPromise) {
      setIsLoading(true);
      const pendingTemplates = await inFlightPromise;
      setTemplates(pendingTemplates);
      setIsLoading(false);
      return pendingTemplates;
    }

    setIsLoading(true);
    setError('');

    inFlightPromise = (async () => {
      try {
        const response = await whatsappCloudService.getTemplates();
        const normalized = normalizeTemplatesResponse(response);
        templatesCache = normalized;
        return normalized;
      } catch (fetchError) {
        setError(parseApiError(fetchError, 'Failed to load templates.'));
        templatesCache = [];
        return [];
      } finally {
        inFlightPromise = null;
      }
    })();

    const nextTemplates = await inFlightPromise;
    setTemplates(nextTemplates);
    setIsLoading(false);
    return nextTemplates;
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    isEmpty: !isLoading && templates.length === 0,
    refetchTemplates: () => fetchTemplates({ force: true }),
  };
}
