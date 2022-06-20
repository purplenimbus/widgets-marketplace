const MARKETPLACE_FEE = 0.15

const applyFees = (amount: number) => amount - (amount*MARKETPLACE_FEE)

export default applyFees;