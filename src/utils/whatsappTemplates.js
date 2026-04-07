export const getTemplateComponents = (template) => {
  if (Array.isArray(template?.components)) return template.components;
  if (Array.isArray(template?.Components)) return template.Components;
  return [];
};

export const getTemplateBodyComponent = (template) =>
  getTemplateComponents(template).find(
    (component) => String(component?.type || '').toUpperCase() === 'BODY'
  ) || null;

export const getTemplateHeaderComponent = (template) =>
  getTemplateComponents(template).find(
    (component) => String(component?.type || '').toUpperCase() === 'HEADER'
  ) || null;

export const getTemplateFooterComponent = (template) =>
  getTemplateComponents(template).find(
    (component) => String(component?.type || '').toUpperCase() === 'FOOTER'
  ) || null;

export const getTemplateButtonsComponent = (template) =>
  getTemplateComponents(template).find(
    (component) => String(component?.type || '').toUpperCase() === 'BUTTONS'
  ) || null;

export const getTemplateVariableCount = (templateOrBody) => {
  const bodyText =
    typeof templateOrBody === 'string'
      ? templateOrBody
      : getTemplateBodyComponent(templateOrBody)?.text || templateOrBody?.body || '';

  const matches = String(bodyText || '').match(/\{\{\d+\}\}/g) || [];
  const numbers = matches
    .map((token) => Number(token.replace(/\D/g, '')))
    .filter((value) => Number.isFinite(value));

  return numbers.length ? Math.max(...numbers) : 0;
};

export const buildTemplatePreview = (template, parameters = []) => {
  const bodyText = getTemplateBodyComponent(template)?.text || template?.body || '';
  return Array.from({ length: getTemplateVariableCount(template) }).reduce(
    (text, _item, index) => text.replaceAll(`{{${index + 1}}}`, parameters[index] || `{{${index + 1}}}`),
    String(bodyText || '')
  );
};

export const normalizeTemplate = (template) => {
  const components = getTemplateComponents(template);
  const bodyComponent = getTemplateBodyComponent(template);
  const headerComponent = getTemplateHeaderComponent(template);
  const footerComponent = getTemplateFooterComponent(template);
  const buttonsComponent = getTemplateButtonsComponent(template);

  return {
    ...template,
    id: template?.id || template?._id || template?.name || crypto.randomUUID(),
    name: String(template?.name || template?.templateName || 'unnamed_template'),
    language:
      (typeof template?.language === 'string' ? template.language : template?.language?.code) ||
      template?.lang ||
      template?.languageCode ||
      'en_US',
    category: String(template?.category || 'utility').toLowerCase(),
    status: String(template?.status || '').toLowerCase(),
    components,
    body:
      String(template?.body || template?.content || bodyComponent?.text || 'Template preview unavailable.'),
    headerText: String(headerComponent?.text || ''),
    headerFormat: String(headerComponent?.format || ''),
    footerText: String(footerComponent?.text || ''),
    buttons: Array.isArray(buttonsComponent?.buttons) ? buttonsComponent.buttons : [],
    variableCount: getTemplateVariableCount(template),
  };
};

export const normalizeTemplatesResponse = (response) => {
  const candidates = [
    response,
    response?.templates,
    response?.items,
    response?.data,
    response?.data?.templates,
    response?.data?.items,
    response?.data?.data,
    response?.data?.data?.templates,
    response?.data?.data?.items,
  ];

  const list = candidates.find(Array.isArray) || [];
  return list.filter(Boolean).map(normalizeTemplate);
};
