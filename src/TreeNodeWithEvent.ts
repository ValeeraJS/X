import { mixin } from "@valeera/eventdispatcher/src/EventFirer";
import TreeNode from "@valeera/tree/src/TreeNode";

const TreeNodeWithEvent = mixin(TreeNode);

export default TreeNodeWithEvent;
