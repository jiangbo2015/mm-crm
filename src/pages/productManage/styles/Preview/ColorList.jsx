import React, { Component } from 'react';
import { Input, Select } from 'antd';
const { Option } = Select;
const { Search } = Input;
// var isHexcolor = require('is-hexcolor');

import styles from './index.less';
import { filterImageUrl } from '@/utils/utils';

const selectProps = {
    placeholder: '输入编码搜索',
};

class ColorList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { colorListData, type } = this.props;
        return (
            <div>
                <Search
                    {...selectProps}
                    style={{ width: 200 }}
                    onSearch={val => {
                        this.props.onSearch({ type, code: val });
                    }}
                />
                <div className={styles.flexWrap}>
                    {colorListData &&
                        colorListData.map(obj => (
                            <div
                                className={styles.thumb}
                                style={{
                                    background:
                                        obj.type === 0
                                            ? obj.value :`url(${filterImageUrl(obj.value)})`,
                                }}
                                onClick={() => {
                                    this.props.onSelect(obj);
                                }}
                            />
                        ))}
                </div>
            </div>
        );
    }
}

export default ColorList;
