export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    posterPath: string | null;
    releaseDate: string;
    voteAverage: number;
  }