export const theaters = [
  {
    id: "t1",
    name: "CineHaus Downtown",
    area: "City Center",
    facilities: ["Dolby", "Parking", "Cafe", "Wheelchair"],
  },
  {
    id: "t2",
    name: "Silver Screen Mall",
    area: "North Mall",
    facilities: ["IMAX", "Food Court", "Parking"],
  },
  {
    id: "t3",
    name: "Noir Multiplex",
    area: "Riverside",
    facilities: ["4DX", "Recliners", "Cafe"],
  },
];

export const shows = [
  // movieId m1
  {
    id: "s1",
    movieId: "m1",
    theaterId: "t1",
    date: "2026-05-12",
    time: "10:30",
  },
  {
    id: "s2",
    movieId: "m1",
    theaterId: "t1",
    date: "2026-05-12",
    time: "19:30",
  },
  {
    id: "s3",
    movieId: "m1",
    theaterId: "t2",
    date: "2026-05-12",
    time: "21:15",
  },
  // movieId m2
  {
    id: "s4",
    movieId: "m2",
    theaterId: "t2",
    date: "2026-05-07",
    time: "11:15",
  },
  {
    id: "s5",
    movieId: "m2",
    theaterId: "t3",
    date: "2026-05-07",
    time: "18:00",
  },
  // movieId m3
  {
    id: "s6",
    movieId: "m3",
    theaterId: "t1",
    date: "2026-05-08",
    time: "20:00",
  },
  // movieId m4
  {
    id: "s7",
    movieId: "m4",
    theaterId: "t3",
    date: "2026-05-12",
    time: "16:45",
  },

  // movieId m11 (Now Showing)
  {
    id: "s8",
    movieId: "m11",
    theaterId: "t1",
    date: "2026-05-12",
    time: "12:00",
  },
  {
    id: "s9",
    movieId: "m11",
    theaterId: "t2",
    date: "2026-05-12",
    time: "15:30",
  },
  {
    id: "s10",
    movieId: "m11",
    theaterId: "t3",
    date: "2026-05-12",
    time: "21:00",
  },
];
