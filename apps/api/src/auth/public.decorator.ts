import { SetMetadata } from '@nestjs/common';

import { PUBLIC_ROUTE_METADATA } from './auth.metadata.js';

export const publicRoute = () => SetMetadata(PUBLIC_ROUTE_METADATA, true);
