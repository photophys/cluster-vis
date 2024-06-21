import styles from "./Logo.module.scss"
import LogoSVG from "../assets/logo-dark.svg"

const Logo = () => (
  <>
    <img className={styles.logo} src={LogoSVG} alt="MOLGA cluster-vis" />
    <div className={styles.wordmark}>cluster-vis</div>
  </>
)

export default Logo
