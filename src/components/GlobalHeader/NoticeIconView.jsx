import React, { Component } from 'react';
import { Tag, message } from 'antd';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import { filterImageUrl } from '@/utils/utils';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

class GlobalHeaderRight extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  changeReadState = clickedItem => {
    const { _id } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: _id,
      });
      window.open(`/#/capsules/${_id}`)
    }
  };

  handleNoticeClear = (title, key) => {
    const { dispatch } = this.props;
    message.success(`${'清空了'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = () => {
    const { notices = [] } = this.props;

    if (notices.length === 0) {
      return {};
    }

    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  };

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach(key => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    const { currentUser, fetchingNotices, onNoticeVisibleChange, notices } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    return (
      <NoticeIcon
        className={styles.action}
        count={notices?.length || 0}
        // onItemClick={item => {
        //   this.changeReadState(item);
        // }}
        // loading={fetchingNotices}
        // clearText="清空"
        // viewMoreText="查看更多"
        // onClear={() => console.log('clear')}
        // onPopupVisibleChange={(v) => v && }
        // onViewMore={() => message.info('Click on view more')}
        // clearClose
      >
        <div style={{maxHeight: '500px', overflow: 'auto', padding: '10px', borderRadius: '6px'}}>
            {
                notices.map(item => (
                    <div 
                        style={{display: 'flex', gap: '10px', marginBottom: '10px', cursor: "pointer"}}
                        onClick={() => this.changeReadState(item)}
                    >
                        <img src={filterImageUrl(item.coverImage)} alt="" width={100} style={{flex: 'none'}} />
                        <div>{item.content}</div>
                    </div>
                ))
            }
        </div>
      </NoticeIcon>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(GlobalHeaderRight);
