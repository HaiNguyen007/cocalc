/*
 *  This file is part of CoCalc: Copyright © 2020 Sagemath, Inc.
 *  License: AGPLv3 s.t. "Commons Clause" – see LICENSE.md for details
 */

import * as React from "react";
import { Icon } from "./icon";

export function Saving() {
  return (
    <span>
      <Icon name="cc-icon-cocalc-ring" spin /> Saving...
    </span>
  );
}
