import { useState, useCallback } from "react";
import { fetchFlow, getErrorMessage } from "../services/api";

export interface UseExecutionFlowResult {
  flowData: any;
  setFlowData: React.Dispatch<React.SetStateAction<any>>;
  isFlowLoading: boolean;
  handleGetFlow: () => Promise<void>;
}

export default function useExecutionFlow(
  repoPath: string,
  setStatus: (status: any) => void
): UseExecutionFlowResult {
  const [flowData, setFlowData] = useState<any>(null);
  const [isFlowLoading, setIsFlowLoading] = useState<boolean>(false);

  const handleGetFlow = useCallback(async () => {
    try {
      setIsFlowLoading(true);
      setStatus({
        tone: "loading",
        label: "Execution Flow",
        message: "Building code pipeline execution tracing...",
      });

      const response = await fetchFlow(repoPath);
      setFlowData(response);
      setStatus({
        tone: "success",
        label: "Execution Flow Ready",
        message: "Flow trace timeline generated successfully.",
      });
    } catch (error) {
      console.error(error);
      const errMsg = getErrorMessage(error, "Failed to generate execution flow timeline.");
      setStatus({
        tone: "error",
        label: "System Error",
        message: errMsg,
      });
    } finally {
      setIsFlowLoading(false);
    }
  }, [repoPath, setStatus]);

  return {
    flowData,
    setFlowData,
    isFlowLoading,
    handleGetFlow,
  };
}
