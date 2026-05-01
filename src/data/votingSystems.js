export const VOTING_SYSTEMS = {
  FPTP: {
    name: 'First Past the Post', shortName: 'FPTP', color: '#3D7EBF',
    description: 'Candidate with most votes in each constituency wins. All other votes produce zero seats.',
  },
  RCV: {
    name: 'Ranked Choice Voting', shortName: 'RCV', color: '#C9A84C',
    description: 'Voters rank candidates 1,2,3… Lowest eliminated, votes redistributed until 50%+ reached.',
  },
  PR: {
    name: 'Proportional Representation', shortName: 'PR', color: '#3D8F6E',
    description: 'Seats allocated proportional to vote share. 30% of votes ≈ 30% of seats (d\'Hondt method).',
  },
}
