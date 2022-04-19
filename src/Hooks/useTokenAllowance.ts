import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { ERC20Contract } from '@/Contracts'
import { Fraction } from '@/Utils'

/**
 * GET: Token Allowance.
 *
 * @param {string} address
 * @param {string} spender
 */
export function useTokenAllowance(address: string, spender: string) {
  // __STATE <React.Hooks>
  const { account } = useWeb3ReactCore()
  const [state, setState] = useState<Fraction>(Fraction.ZERO)

  // __FUNCTIONS
  const getAllowance = useCallback(async () => {
    if (!account) return void 0

    try {
      const { methods: contract } = ERC20Contract.build(address)
      const response = await contract.allowance(account, spender).call()
      const vaule = Fraction.from(response)

      setState(vaule)
    } catch (error) {
      console.error('`useTokenAllowance`', error)
    }
  }, [account, address, spender])

  // __EFFECTS
  useEffect(() => {
    if (account) getAllowance()
  }, [account, address])

  // __RETURN
  return useMemo(() => state, [account, state])
}