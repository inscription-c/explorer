export type SortBy = 'newest' | 'oldest';
export type ContentType = null | 'all' | 'text' | 'image';
export type ContentProtocol = null | 'all' | 'c-brc-20' | 'c-brc-420';
export type Charm = 'pure' | 'cursed';

export interface Inscription {
    inscription_id: string;
    inscription_number: number;
    content_type: string;
    content_length: number;
    content_protocol: string;
    timestamp: string;
    owner_output: string;
    owner_address: string;
    sat: string;
    c_ins_description: {
        type: string;
        chain: string;
        chain_name: string;
        contract: string;
    };
};

export interface InscriptionDetail {
  inscription_id: string;
  charms: any[];
  inscription_number: number;
  next: string;
  previous: string;
  address: string;
  sat: number;
  content_length: number;
  content_type: string;
  genesis_fee: number;
  genesis_height: number;
  output_value: number;
  satpoint: string;
  timestamp: number;
  c_ins_description: {
    type: string;
    chain: string;
    contract: string;
  };
  content_protocol: string;
};

export interface InscriptionState {
  loading: boolean;
  inscriptions: Inscription[];
  details: Map<string, InscriptionDetail>,
  contents: Map<string, any>;
  sortBy: SortBy ;
  contentType: ContentType ;
  contentProtocol: ContentProtocol;
  charm: Charm,
  page: number;
  limit: number;
  total: number;
}
