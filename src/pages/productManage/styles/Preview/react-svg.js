import React from "react"
import { ReactSVG } from "react-svg"
// export default props => {
// 	const memoDom = useMemo(() => {
// 		return
// 	}, [])
// 	return { memoDom }
// }

class Svg extends React.Component {
	shouldComponentUpdate(nextProps) {
		if (this.props.src !== nextProps.src) {
			return true
		} else {
			return false
		}
	}
	render() {
		return <ReactSVG {...this.props} />
	}
}

export default Svg
