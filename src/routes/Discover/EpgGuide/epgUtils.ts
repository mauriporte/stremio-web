// Copyright (C) 2017-2026 Smart code 203358507

import type { EPGProgram } from './useEPG';

const programStartMs = (program: EPGProgram): number => {
    return new Date(program.start).getTime();
};

const programEndMs = (program: EPGProgram): number => {
    return new Date(program.stop).getTime();
};

const programTitle = (program: EPGProgram): string => {
    return program.title;
};

export {
    programStartMs,
    programEndMs,
    programTitle,
};
