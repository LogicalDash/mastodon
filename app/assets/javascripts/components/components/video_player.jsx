import ImmutablePropTypes from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import IconButton from './icon_button';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  toggle_sound: { id: 'video_player.toggle_sound', defaultMessage: 'Toggle sound' },
  toggle_visible: { id: 'video_player.toggle_visible', defaultMessage: 'Toggle visibility' }
});

const videoStyle = {
  position: 'relative',
  zIndex: '1',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  top: '50%',
  transform: 'translateY(-50%)'
};

const muteStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  opacity: '0.8',
  zIndex: '5'
};

const spoilerStyle = {
  marginTop: '8px',
  background: '#000',
  color: '#fff',
  textAlign: 'center',
  height: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative'
};

const spoilerSpanStyle = {
  display: 'block',
  fontSize: '14px'
};

const spoilerSubSpanStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '500'
};

const spoilerButtonStyle = {
  position: 'absolute',
  top: '6px',
  left: '8px',
  zIndex: '100'
};

const VideoPlayer = React.createClass({
  propTypes: {
    media: ImmutablePropTypes.map.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    sensitive: React.PropTypes.bool
  },

  getDefaultProps () {
    return {
      width: 196,
      height: 110
    };
  },

  getInitialState () {
    return {
      visible: !this.props.sensitive,
      preview: true,
      muted: true
    };
  },

  mixins: [PureRenderMixin],

  handleClick () {
    this.setState({ muted: !this.state.muted });
  },

  handleVideoClick (e) {
    e.stopPropagation();

    const node = ReactDOM.findDOMNode(this).querySelector('video');

    if (node.paused) {
      node.play();
    } else {
      node.pause();
    }
  },

  handleOpen () {
    this.setState({ preview: !this.state.preview });
  },

  handleVisibility () {
    this.setState({
      visible: !this.state.visible,
      preview: true
    });
  },

  render () {
    const { media, intl, width, height, sensitive } = this.props;

    let spoilerButton = (
      <div style={spoilerButtonStyle} >
        <IconButton title={intl.formatMessage(messages.toggle_visible)} icon={this.state.visible ? 'eye' : 'eye-slash'} onClick={this.handleVisibility} />
      </div>
    );

    if (!this.state.visible) {
      if (sensitive) {
        return (
          <div style={{...spoilerStyle, width: `${width}px`, height: `${height}px` }} onClick={this.handleVisibility}>
            {spoilerButton}
            <span style={spoilerSpanStyle}><FormattedMessage id='status.sensitive_warning' defaultMessage='Sensitive content' /></span>
            <span style={spoilerSubSpanStyle}><FormattedMessage id='status.sensitive_toggle' defaultMessage='Click to view' /></span>
          </div>
        );
      } else {
        return (
          <div style={{...spoilerStyle, width: `${width}px`, height: `${height}px` }} onClick={this.handleOpen}>
            {spoilerButton}
            <span style={spoilerSpanStyle}><FormattedMessage id='status.media_hidden' defaultMessage='Media hidden' /></span>
            <span style={spoilerSubSpanStyle}><FormattedMessage id='status.sensitive_toggle' defaultMessage='Click to view' /></span>
          </div>
        );
      }
    }

    if (this.state.preview) {
      return (
        <div style={{ cursor: 'pointer', position: 'relative', marginTop: '8px', width: `${width}px`, height: `${height}px`, background: `url(${media.get('preview_url')}) no-repeat center`, backgroundSize: 'cover' }} onClick={this.handleOpen}>
          {spoilerButton}
          <div style={{ position: 'absolute', top: '50%', left: '50%', fontSize: '36px', transform: 'translate(-50%, -50%)', padding: '5px', borderRadius: '100px', color: 'rgba(255, 255, 255, 0.8)' }}><i className='fa fa-play' /></div>
        </div>
      );
    }

    return (
      <div style={{ cursor: 'default', marginTop: '8px', overflow: 'hidden', width: `${width}px`, height: `${height}px`, boxSizing: 'border-box', background: '#000', position: 'relative' }}>
        {spoilerButton}
        <div style={muteStyle}><IconButton title={intl.formatMessage(messages.toggle_sound)} icon={this.state.muted ? 'volume-off' : 'volume-up'} onClick={this.handleClick} /></div>
        <video src={media.get('url')} autoPlay='true' loop={true} muted={this.state.muted} style={videoStyle} onClick={this.handleVideoClick} />
      </div>
    );
  }

});

export default injectIntl(VideoPlayer);
