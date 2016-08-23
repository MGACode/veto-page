import { create } from 'jss'
import preset from 'jss-preset-default'

const jss = create(preset())

const styles = {
  mapPanel: {
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 5,
    display: 'flex',
    flexDirection: 'column',
    fontSize: 30,
    fontWeight: 500,
    height: 220,
    maxWidth: 300,
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    textShadow: '1px 2px 1px #000',
    transition: 'all .1s',
    margin: 'auto',

    '&.default': {
      borderColor: '#fff',
      color: '#fff',
      borderWidth: 2,

      '&:hover': {
        borderWidth: 5
      }
    },
    '&.team-1': {
      borderColor: '#e85151',
      color: '#e85151',
    },
    '&.team-2': {
      borderColor: '#62b7f7',
      color: '#62b7f7',
    },
    '&.random': {
      borderColor: 'rgb(165, 94, 233)',
      color: 'rgb(165, 94, 233)',
    }
  },
  ban: {
    color: '#f49c61'
  },
  pick: {
    color: '#73f461'
  },
  status: {
    fontWeight: 700
  },
  mapName: {
    top: 10,
    left: 0,
    right: 0,
    position: 'absolute',
    color: '#fff'
  }
}

export default jss.createStyleSheet(styles).attach().classes
