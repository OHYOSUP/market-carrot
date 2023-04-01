import { useState } from "react";

interface UseMutaionState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}
type useMutationResult<T> = [(data: any) => void, UseMutaionState<T>];

interface mutationState {
  loading: boolean;
  data: undefined | any;
  error: undefined | any;
}
export default function useMutation<T = any>(
  url: string
): useMutationResult<T> {
  const [state, setState] = useState<mutationState>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  // const { loading, data, error } = state;
  function mutation(data: any) {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json().catch((err) => {}))
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((err) => setState((prev) => ({ ...prev, err })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }
  return [mutation, { ...state }];
}
