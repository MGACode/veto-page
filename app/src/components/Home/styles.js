import { create } from 'jss'
import preset from 'jss-preset-default'

const jss = create(preset())

const styles = {
  lobby: {
    width: 200,
    height: 200,
    border: '5px solid #fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto'
  }
}

export default jss.createStyleSheet(styles).attach().classes
