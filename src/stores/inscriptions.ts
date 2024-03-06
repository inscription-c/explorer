import { defineStore } from 'pinia';
import { toast } from 'vuetify-sonner';
import indexerClient from '@/utils/indexer-client';
import explorerClient from '@/utils/explorer-client';
import type { Inscription, InscriptionState, SortBy, ContentProtocol, ContentType, InscriptionDetail, Charm } from '@/types/Inscriptions';

export const useInscriptionStore = defineStore({
  id: 'inscriptions',
  state: (): InscriptionState => ({
    loading: false,
    inscriptions: [],
    details: new Map(),
    contents: new Map(),
    sortBy: 'newest',
    contentType: null,
    contentProtocol: null,
    charm: 'pure',
    page: 1,
    limit: 20,
    total: 0
  }),
  getters: {
    pages: (state) => {
      return Math.ceil(state.total / state.limit)
    },
    getContentById: (state) => {
      return (id: string) => state.contents.get(id)
    },
  },
  actions: {
    async fetchInscriptions () {
      if (this.loading) return false;
      this.loading = true;

      console.log('Fetching inscriptions')

      try {
        let params: any = {
          page: this.page,
          limit: this.limit,
          order: this.sortBy,
          charms: this.charm === 'cursed' ? ['cursed'] : [],
        }

        if (this.contentType && this.contentType !== 'all') {
          params['types'] = [this.contentType];
        }

        if (this.contentProtocol && this.contentProtocol !== 'all') {
          params['inscription_type'] = this.contentProtocol;
        }

        const data = await explorerClient.post('/inscriptions', params);

        const respData = data.data;
        this.inscriptions = respData.list;
        this.page = respData.page;
        this.total = respData.total;
      } catch (error) {
        console.error(error);
      }

      this.loading = false;
    },
    async fetchExplorerDetailById (id: string): Promise<Inscription | undefined> {
      const data = this.inscriptions.find(i => i.inscription_id === id);
      if (data) {
        console.log(`Found browser detail cache of ${id}, return directly.`)
        return data
      }

      console.log(`Fetching browser detail of ${id} ...`)

      try {
        let params: any = {
          search: id,
          page: 1,
          limit: 1,
        }

        const data = await explorerClient.post('/inscriptions', params);
        return data.data.list.pop()
      } catch (error) {
        console.log(error);
      }
    },
    async fetchDetailById (id: string): Promise<InscriptionDetail | undefined> {
      if (this.details.has(id)) {
        console.log(`Found detail cache of ${id}, return directly.`)
        return this.details.get(id)
      }

      console.log(`Fetching detail of ${id} ...`)

      try {
        const data = await indexerClient.get(`/inscription/${id}`)
        return data.data
      } catch (error) {
        console.log(error);
      }
    },
    async fetchContentById (id: string) {
      if (this.contents.has(id)) {
        console.log(`Found content cache of ${id}, return directly.`)
        return this.contents.get(id)
      }

      console.log(`Fetching content of ${id} ...`)

      try {
        const data = await indexerClient.get(`/content/${id}`)
        return data.data
      } catch (error) {
        console.log(error);
      }
    },
    async searchInscriptions (search: string, replace = true): Promise<string | false> {
      if (this.loading) return false;
      this.loading = true;

      console.log('Searching inscriptions with text: ', search);

      try {
        let params: any = {
          search,
          page: this.page,
          limit: this.limit,
          order: this.sortBy,
          charms: this.charm === 'cursed' ? ['cursed'] : [],
        }

        if (this.contentType && this.contentType !== 'all') {
          params['types'] = [this.contentType];
        }

        if (this.contentProtocol && this.contentProtocol !== 'all') {
          params['inscription_type'] = this.contentProtocol;
        }

        const data = await explorerClient.post('/inscriptions', params);

        const respData = data.data;
        this.page = respData.page;
        this.total = respData.total;

        if (replace) {
          this.inscriptions = respData.list;
        } else {
          this.inscriptions.push(...respData.list);
        }

        this.loading = false;
        return respData.search_type;
      } catch (error: any) {
        console.error(error);

        if (error.response) {
          switch (error.response.status) {
            case 404:
              toast.error('No inscriptions found.');
              break;
            default:
              console.error(error);
          }
        }

        this.loading = false;
        return false;
      }
    },
    selectPage (page: number, limit: number) {
      this.page = page;
      this.limit = limit;
    },
    selectSortBy (sortBy: SortBy) {
      this.sortBy = sortBy;
      this.page = 1
    },
    selectContentType (contentType: ContentType) {
      this.contentType = contentType;
      this.page = 1
    },
    selectContentProtocol (contentProtocol: ContentProtocol) {
      this.contentProtocol = contentProtocol;
      this.page = 1
    },
    selectCharm (charm: Charm) {
      this.charm = charm;
      this.page = 1
    },
    reset () {
      this.sortBy = 'newest';
      this.contentType = null;
      this.contentProtocol = null;
      this.page = 1;
      this.limit = 20;
    }
  }
});
