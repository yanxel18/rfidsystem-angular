import gql from 'graphql-tag';

export const DOWNLOAD_KETSU_LOG = gql`
  query GetLogs($toShow: Boolean!, $skip: Int, $take: Int) {
    DownloadKetsuLogs(toShow: $toShow, skip: $skip, take: $take)
  }
`;
