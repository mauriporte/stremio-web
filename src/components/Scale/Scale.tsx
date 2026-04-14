import React, { MouseEvent, TouchEvent } from 'react';
import classNames from 'classnames';
import styles from './Scale.less';

type Props = {
    min: number,
    max: number,
    step: number,
    value: number,
    options: number[],
    tabIndex?: number,
    onChange: (value: number) => void,
};

const Scale = ({ min, max, step, options, value, tabIndex, onChange }: Props) => {
    const onInputChange = ({ target }: MouseEvent<HTMLInputElement> | TouchEvent<HTMLInputElement>) => {
        const { value } = target as HTMLInputElement;
        onChange(parseInt(value));
    };

    const onClick = ({ target }: MouseEvent<HTMLDivElement>) => {
        const { dataset } = target as HTMLInputElement;
        onChange(parseInt(dataset.value!));
    };

    return (
        <div className={styles['scale']}>
            <div className={styles['ticks']}>
                {
                    options.map((tick) => (
                        <div
                            className={classNames(styles['label'], { [styles['active']]: value === tick })}
                            key={tick}
                            data-value={tick}
                            onClick={onClick}
                        >
                            {tick}
                        </div>
                    ))
                }
            </div>
            <input
                type={'range'}
                key={value}
                tabIndex={tabIndex}
                defaultValue={value}
                min={min}
                max={max}
                step={step}
                onMouseUp={onInputChange}
                onTouchEnd={onInputChange}
            />
        </div>
    );
};

export default Scale;
