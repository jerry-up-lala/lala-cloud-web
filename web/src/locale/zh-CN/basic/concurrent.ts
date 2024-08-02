export default {
  'basic.concurrent.corePoolSize': '核心线程数',
  'basic.concurrent.maximumPoolSize': '最大线程数',
  'basic.concurrent.keepAliveTime': '非核心线程等待时间',
  'basic.concurrent.workQueueType': '队列类型',
  'basic.concurrent.workQueueType.linkedBlockingQueue':
    'LinkedBlockingQueue(有界阻塞队列,链式结构(链接节点)、FIFO)',
  'basic.concurrent.workQueueType.arrayBlockingQueue':
    'ArrayBlockingQueue(有界阻塞队列、数组结构、FIFO)',
  'basic.concurrent.workQueueType.linkedBlockingDeque':
    'LinkedBlockingDeque(有界阻塞双端队列、链式结构)',
  'basic.concurrent.workQueueType.priorityBlockingQueue':
    'PriorityBlockingQueue(有界阻塞队列、优先级)',
  'basic.concurrent.workQueueType.linkedTransferQueue':
    'LinkedTransferQueue(无界阻塞队列、链式结构)',
  'basic.concurrent.workQueueType.synchronousQueue':
    'SynchronousQueue(不存储元素的阻塞队列、每个插入操作必须等待一个移出操作)',
  'basic.concurrent.workQueueSize': '队列大小',
  'basic.concurrent.rejectedExecutionType': '饱和策略',
  'basic.concurrent.rejectedExecutionType.abortPolicy': 'AbortPolicy(抛出异常)',
  'basic.concurrent.rejectedExecutionType.callerRunsPolicy':
    'CallerRunsPolicy(当前线程执行)',
  'basic.concurrent.rejectedExecutionType.discardOldestPolicy':
    'DiscardOldestPolicy(丢弃队列最靠前任务)',
  'basic.concurrent.rejectedExecutionType.discardPolicy':
    'DiscardPolicy(直接丢弃任务)',
  'basic.concurrent.runTotal': '任务总量',
  'basic.concurrent.threadName': '线程名称',
  'basic.concurrent.runDateTime': '执行时间',
};
