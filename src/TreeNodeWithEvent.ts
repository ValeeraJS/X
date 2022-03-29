import { mixin } from "@valeera/eventdispatcher";
import { TreeNode } from "@valeera/tree";

const TreeNodeWithEvent = mixin(TreeNode);

export default TreeNodeWithEvent;
