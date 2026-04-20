import React from 'react';
import classNames from 'classnames';
import styles from './HdrBadge.less';

type HdrInfo = {
    gamma?: string | null,
    primaries?: string | null,
};

type Props = {
    className?: string,
    hdrInfo: HdrInfo | null,
};

const labelFor = (hdrInfo: HdrInfo | null): string | null => {
    const gamma = hdrInfo?.gamma?.toLowerCase();
    if (gamma === 'pq') return 'HDR10';
    if (gamma === 'hlg') return 'HLG';
    return null;
};

const HdrBadge = ({ className, hdrInfo }: Props) => {
    const label = labelFor(hdrInfo);
    if (!label) return null;

    return (
        <div className={classNames(className, styles['hdr-badge-container'])}>
            <div className={styles['hdr-badge']}>{label}</div>
        </div>
    );
};

export default HdrBadge;
