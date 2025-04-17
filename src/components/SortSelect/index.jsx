import arrowIcon from '@/assets/arrow.svg';
import { Select } from 'antd';
import { ReactSVG } from 'react-svg';

import styles from './index.less';

export default ({ options, width, mode = 'default', style = {}, ...props }) => {
    return (
        <div style={{ display: 'flex', ...style }}>
            <Select
                style={{ width }}
                className={styles['mrmissSelect']}
                options={options}
                {...props}
            />
            <div className={styles['arrow-group']}>
                <ReactSVG
                    src={arrowIcon}
                    style={{
                        width: '6px',
                        height: '6px',
                        lineHeight: '6px',
                    }}
                />
                <ReactSVG
                    src={arrowIcon}
                    style={{
                        width: '6px',
                        height: '6px',
                        lineHeight: '6px',
                        transform: 'rotateZ(180deg)',
                    }}
                />
            </div>
        </div>
    );
};
