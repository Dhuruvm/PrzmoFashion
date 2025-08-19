/**
 * Advanced Job Queue System - BullMQ Style Implementation
 * Provides background processing for orders, emails, and commerce operations
 */

import { EventEmitter } from 'events';

export interface JobData {
  id: string;
  type: string;
  data: any;
  priority?: number;
  delay?: number;
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
}

export interface JobResult {
  success: boolean;
  result?: any;
  error?: string;
  duration: number;
}

export interface QueueOptions {
  concurrency?: number;
  defaultJobOptions?: Partial<JobData>;
  retryDelayOnError?: number;
}

class JobProcessor extends EventEmitter {
  private jobs = new Map<string, JobData>();
  private activeJobs = new Set<string>();
  private processing = false;
  private concurrency: number;
  private retryDelayOnError: number;

  constructor(private options: QueueOptions = {}) {
    super();
    this.concurrency = options.concurrency || 3;
    this.retryDelayOnError = options.retryDelayOnError || 5000;
  }

  /**
   * Add job to queue with priority support
   */
  async add(type: string, data: any, jobOptions: Partial<JobData> = {}): Promise<string> {
    const jobId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: JobData = {
      id: jobId,
      type,
      data,
      priority: jobOptions.priority || 0,
      delay: jobOptions.delay || 0,
      attempts: jobOptions.attempts || 3,
      backoff: jobOptions.backoff || { type: 'exponential', delay: 1000 },
      ...this.options.defaultJobOptions,
      ...jobOptions
    };

    this.jobs.set(jobId, job);
    
    console.log(`📋 Job queued: ${type} (${jobId})`);
    this.emit('job:added', job);
    
    // Start processing if not already running
    if (!this.processing) {
      this.startProcessing();
    }

    return jobId;
  }

  /**
   * Start processing jobs from the queue
   */
  private async startProcessing(): Promise<void> {
    if (this.processing) return;
    
    this.processing = true;
    console.log('🚀 Job queue processing started');

    while (this.jobs.size > 0 || this.activeJobs.size > 0) {
      const availableSlots = this.concurrency - this.activeJobs.size;
      
      if (availableSlots > 0) {
        const nextJobs = this.getNextJobs(availableSlots);
        
        for (const job of nextJobs) {
          this.processJob(job);
        }
      }

      // Wait before checking for new jobs
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.processing = false;
    console.log('✅ Job queue processing completed');
  }

  /**
   * Get next jobs to process based on priority and delay
   */
  private getNextJobs(count: number): JobData[] {
    const availableJobs = Array.from(this.jobs.values())
      .filter(job => !this.activeJobs.has(job.id))
      .filter(job => !job.delay || Date.now() >= job.delay)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, count);

    return availableJobs;
  }

  /**
   * Process individual job
   */
  private async processJob(job: JobData): Promise<void> {
    const startTime = Date.now();
    this.activeJobs.add(job.id);
    
    try {
      console.log(`⚡ Processing job: ${job.type} (${job.id})`);
      this.emit('job:started', job);

      const result = await this.executeJob(job);
      const duration = Date.now() - startTime;

      const jobResult: JobResult = {
        success: true,
        result,
        duration
      };

      console.log(`✅ Job completed: ${job.type} (${job.id}) in ${duration}ms`);
      this.emit('job:completed', job, jobResult);

    } catch (error) {
      const duration = Date.now() - startTime;
      const jobResult: JobResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };

      console.error(`❌ Job failed: ${job.type} (${job.id}) - ${jobResult.error}`);
      this.emit('job:failed', job, jobResult);

      // Handle retries
      await this.handleJobRetry(job);
    } finally {
      this.activeJobs.delete(job.id);
      this.jobs.delete(job.id);
    }
  }

  /**
   * Execute job based on type
   */
  private async executeJob(job: JobData): Promise<any> {
    switch (job.type) {
      case 'order:process':
        return await this.processOrder(job.data);
      
      case 'email:send':
        return await this.sendEmail(job.data);
      
      case 'inventory:update':
        return await this.updateInventory(job.data);
      
      case 'currency:convert':
        return await this.convertCurrency(job.data);
      
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  /**
   * Process order workflow
   */
  private async processOrder(orderData: any): Promise<any> {
    console.log('🛒 Processing order:', orderData.orderId);
    
    // Simulate order processing steps
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Queue related jobs
    await this.add('email:send', {
      type: 'order_confirmation',
      orderId: orderData.orderId,
      customerEmail: orderData.customerEmail
    }, { priority: 5 });

    await this.add('inventory:update', {
      items: orderData.items
    }, { priority: 3 });

    return { orderId: orderData.orderId, status: 'processed' };
  }

  /**
   * Send email job
   */
  private async sendEmail(emailData: any): Promise<any> {
    console.log('📧 Sending email:', emailData.type);
    
    // Import email service dynamically to avoid circular dependencies
    const { sendRealEmail } = await import('./email-test-service');
    
    const success = await sendRealEmail({
      to: emailData.customerEmail,
      from: 'noreply@przmo.com',
      subject: `PRZMO Order ${emailData.type === 'order_confirmation' ? 'Confirmation' : 'Update'}`,
      text: `Your order ${emailData.orderId} has been ${emailData.type === 'order_confirmation' ? 'confirmed' : 'updated'}.`,
      html: `<h2>PRZMO Order ${emailData.type === 'order_confirmation' ? 'Confirmation' : 'Update'}</h2><p>Your order <strong>${emailData.orderId}</strong> has been processed successfully.</p>`
    });

    return { emailSent: success, type: emailData.type };
  }

  /**
   * Update inventory job
   */
  private async updateInventory(inventoryData: any): Promise<any> {
    console.log('📦 Updating inventory for:', inventoryData.items?.length, 'items');
    
    // Simulate inventory update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { inventoryUpdated: true, items: inventoryData.items };
  }

  /**
   * Convert currency job
   */
  private async convertCurrency(currencyData: any): Promise<any> {
    console.log('💱 Converting currency:', currencyData.from, 'to', currencyData.to);
    
    // This will be implemented with the currency service
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { 
      originalAmount: currencyData.amount,
      convertedAmount: currencyData.amount * 1.1, // Placeholder conversion
      from: currencyData.from,
      to: currencyData.to
    };
  }

  /**
   * Handle job retry logic
   */
  private async handleJobRetry(job: JobData): Promise<void> {
    const attempts = (job.attempts || 3) - 1;
    
    if (attempts > 0) {
      let delay = 0;
      
      if (job.backoff?.type === 'exponential') {
        delay = job.backoff.delay * Math.pow(2, 3 - attempts);
      } else {
        delay = job.backoff?.delay || this.retryDelayOnError;
      }

      console.log(`🔄 Retrying job ${job.id} in ${delay}ms (${attempts} attempts left)`);
      
      // Re-queue job with updated attempts and delay
      setTimeout(() => {
        this.jobs.set(job.id, { ...job, attempts, delay: Date.now() + delay });
      }, delay);
    }
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    pending: number;
    active: number;
    completed: number;
    failed: number;
  } {
    return {
      pending: this.jobs.size,
      active: this.activeJobs.size,
      completed: 0, // This would be tracked in a real implementation
      failed: 0     // This would be tracked in a real implementation
    };
  }
}

// Export singleton instance
export const jobQueue = new JobProcessor({
  concurrency: 5,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  }
});

export { JobProcessor };