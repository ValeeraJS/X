import { mixin } from "@valeera/eventdispatcher/src/EventDispatcher";
import TreeNode from "@valeera/tree/src/TreeNode";

const TreeNodeWithEvent = mixin(TreeNode);

export default TreeNodeWithEvent;
