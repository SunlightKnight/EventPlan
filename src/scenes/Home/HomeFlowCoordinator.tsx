import { useEffect } from "react";
import Label from "../../components/Label";
import colors from "../../styles/colors";
import padding from "../../styles/padding";

type HomeFlowCoordinatorProps = {
  handleLoader: () => void
}

function HomeFlowCoordinator(props: HomeFlowCoordinatorProps) {
  useEffect(() => {
    console.log("*** HomeFlowCoordinator - RENDERED")
  }, [])

  return (
    <Label color={colors.black} style={{marginTop: padding.triple}}>HOME</Label>
  )
}

export default HomeFlowCoordinator