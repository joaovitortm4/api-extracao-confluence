require("dotenv").config();
const axios = require("axios");

const EMAIL = process.env.EMAIL;
const API_TOKEN = process.env.API_TOKEN;
const BASE_URL = process.env.BASE_URL;
const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID;

const auth = {
  auth: {
    username: EMAIL,
    password: API_TOKEN,
  },
};

async function getPageChildren(pageId) {
  try {
    const response = await axios.get(`${BASE_URL}/${pageId}/child/page`, auth);
    return response.data.results || [];
  } catch (error) {
    console.error(`Erro ao obter subpáginas de ${pageId}:`, error.message);
    return [];
  }
}

async function getPageContent(pageId) {
  try {
    const response = await axios.get(`${BASE_URL}/${pageId}?expand=body.storage`, auth);
    return response.data.body.storage.value || "";
  } catch (error) {
    console.error(`Erro ao obter conteúdo de ${pageId}:`, error.message);
    return "";
  }
}

async function getAllPagesRecursive(parentId) {
  let pages = [];
  async function fetchRecursive(pageId) {
    const subpages = await getPageChildren(pageId);
    for (const subpage of subpages) {
      const content = await getPageContent(subpage.id);
      pages.push({
        id: subpage.id,
        title: subpage.title,
        content: content.replace(/<[^>]*>?/gm, ""), // Remove tags HTML
      });
      await fetchRecursive(subpage.id); // Busca sub-subpáginas
    }
  }
  await fetchRecursive(parentId);
  return pages;
}

async function extractAllData() {
  return await getAllPagesRecursive(ROOT_PAGE_ID);
}

module.exports = { extractAllData };
